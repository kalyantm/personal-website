/**
 * Garmin Connect Personal API client (official, read-only).
 * https://developer.garmin.com/gc-developer-program/personal/personal-api/
 *
 * Auth: your Personal API key (GARMIN_PERSONAL_API_KEY) is exchanged for a JWT bearer token
 * that lasts 24 hours. There are no refresh tokens, so we cache the token in memory and
 * re-exchange the key shortly before it expires.
 *
 * Paths mirror Garmin's own Python client (github.com/garmin/connect-personal-api-python).
 */

import crypto from "crypto";
import fs from "fs";
import os from "os";
import path from "path";

const BASE_URL = (process.env.GARMIN_PERSONAL_API_BASE_URL || "https://personal.connectapi.garmin.com").replace(/\/$/, "");
const TOKEN_PATH = "/personalapitoken-service/personal-api/personal-api-key/token";
const REFRESH_WINDOW_MS = 60 * 60 * 1000; // re-exchange an hour before expiry
const TIMEOUT_MS = 20_000;

export class GarminError extends Error {
  constructor(message: string, readonly status?: number, readonly path?: string) {
    super(message);
    this.name = "GarminError";
  }
}

let cached: { token: string; expiresAt: number } | null = null;

/*
 * The token is also kept in a file, so separate processes (scripts, serverless cold starts on
 * the same instance) reuse it instead of re-exchanging the key, which Garmin rate-limits.
 * Override the location with GARMIN_TOKEN_CACHE.
 */
function tokenFile(): string {
  return process.env.GARMIN_TOKEN_CACHE || path.join(os.tmpdir(), "garmin-personal-api-token.json");
}
function keyFingerprint(): string {
  return crypto.createHash("sha256").update(`${BASE_URL}\0${apiKey()}`).digest("hex");
}
function readTokenFile(): { token: string; expiresAt: number } | null {
  try {
    const raw = JSON.parse(fs.readFileSync(tokenFile(), "utf8"));
    if (raw?.fingerprint === keyFingerprint() && typeof raw.token === "string" && typeof raw.expiresAt === "number") return raw;
  } catch {
    // no cache yet
  }
  return null;
}
function writeTokenFile(t: { token: string; expiresAt: number }) {
  try {
    fs.writeFileSync(tokenFile(), JSON.stringify({ ...t, fingerprint: keyFingerprint() }), { mode: 0o600 });
  } catch {
    // read-only filesystem: the in-memory cache still works
  }
}

function apiKey(): string {
  const key = process.env.GARMIN_PERSONAL_API_KEY?.trim();
  if (!key) throw new GarminError("GARMIN_PERSONAL_API_KEY is not set");
  return key;
}

export function hasGarminKey(): boolean {
  return Boolean(process.env.GARMIN_PERSONAL_API_KEY?.trim());
}

function jwtExpiry(token: string): number {
  try {
    const payload = JSON.parse(Buffer.from(token.split(".")[1], "base64url").toString("utf8"));
    if (typeof payload.exp === "number") return payload.exp * 1000;
  } catch {
    // fall through
  }
  return Date.now() + 23 * 60 * 60 * 1000;
}

async function timedFetch(url: string, init: RequestInit): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function bearerToken(): Promise<string> {
  if (cached && cached.expiresAt - Date.now() > REFRESH_WINDOW_MS) return cached.token;
  const fromFile = readTokenFile();
  if (fromFile && fromFile.expiresAt - Date.now() > REFRESH_WINDOW_MS) {
    cached = fromFile;
    return fromFile.token;
  }
  const res = await timedFetch(`${BASE_URL}${TOKEN_PATH}`, {
    method: "POST",
    headers: { Accept: "*/*", Authorization: `ApiKey ${apiKey()}` },
  });
  if (!res.ok) throw new GarminError(`Token exchange failed (${res.status})`, res.status, TOKEN_PATH);
  const token = (await res.text()).trim();
  cached = { token, expiresAt: jwtExpiry(token) };
  writeTokenFile(cached);
  return token;
}

type Params = Record<string, string | number | undefined>;

export async function garminGet<T = unknown>(path: string, params?: Params): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params ?? {})) if (v !== undefined) qs.set(k, String(v));
  const url = `${BASE_URL}${path}${qs.toString() ? `?${qs}` : ""}`;

  let res = await timedFetch(url, { headers: { Accept: "application/json", Authorization: `Bearer ${await bearerToken()}` } });
  if (res.status === 401) {
    // Token revoked or clock skew: exchange once more and retry.
    cached = null;
    res = await timedFetch(url, { headers: { Accept: "application/json", Authorization: `Bearer ${await bearerToken()}` } });
  }
  if (!res.ok) throw new GarminError(`GET ${path} failed (${res.status})`, res.status, path);
  const text = await res.text();
  return (text ? JSON.parse(text) : null) as T;
}

/** Inclusive date ranges are YYYY-MM-DD. Range limits per Garmin: stress/steps 28 days, sleep 31, daily summaries 1 year. */
export const garmin = {
  dailySummaries: (start: string, end: string) => garminGet("/usersummary-service/v2/dailysummaries", { startDate: start, endDate: end }),
  hrvSummaries: (start: string, end: string) => garminGet(`/hrv-service/hrv/daily/${start}/${end}`),
  hrv: (date: string) => garminGet(`/hrv-service/hrv/${date}`),
  sleepSummaries: (start: string, end: string) => garminGet("/sleep-service/sleep/dailySleepSummariesByDate", { startDate: start, endDate: end }),
  sleep: (date: string) => garminGet("/sleep-service/sleep/dailySleep", { date }),
  bodyBattery: (start: string, end: string) => garminGet("/wellness-service/wellness/bodyBattery/reports/daily", { startDate: start, endDate: end }),
  stress: (start: string, end: string) => garminGet(`/usersummary-service/stats/stress/daily/${start}/${end}`),
  heartRate: (date: string) => garminGet("/wellness-service/wellness/dailyHeartRate", { date }),
  vo2max: (start: string, end: string) => garminGet(`/metrics-service/metrics/maxmet/daily/${start}/${end}`),
  activities: (opts: { start?: number; limit?: number; startDate?: string; endDate?: string; activityType?: string } = {}) =>
    garminGet("/activitylist-service/activities/search/activities", { start: 0, limit: 20, ...opts }),
  activity: (id: number | string) => garminGet(`/activity-service/activity/${id}`),
  profileSettings: () => garminGet("/userprofile-service/userprofile/settings"),
  weights: (start: string, end: string) => garminGet(`/weight-service/weight/range/${start}/${end}`),
  heartRateZones: () => garminGet("/biometric-service/heartRateZones/v2"),
};

/** GET raw bytes (the original FIT upload comes back as a ZIP). */
export async function garminGetBytes(path: string): Promise<Uint8Array> {
  const get = async () =>
    timedFetch(`${BASE_URL}${path}`, { headers: { Accept: "application/octet-stream, */*", Authorization: `Bearer ${await bearerToken()}` } });
  let res = await get();
  if (res.status === 401) {
    cached = null;
    res = await get();
  }
  if (!res.ok) throw new GarminError(`GET ${path} failed (${res.status})`, res.status, path);
  return new Uint8Array(await res.arrayBuffer());
}

export const downloadActivityFit = (id: number | string) => garminGetBytes(`/download-service/files/activity/${id}`);
