/**
 * Maps Garmin Personal API responses onto the parts of DashboardData that Garmin owns:
 * the date and sync time, this week's activities, the five Recovery metrics and the
 * progress markers.
 *
 * Phase 1 only presents what happened. The plan-driven sections (Today's call, Run build,
 * Fuel, Fitness and form) still use sample-data.ts until phase 2 adds a plan store.
 */
import { getSampleDashboard } from "~/lib/fitness/sample-data";
import { minutesToHM } from "~/lib/fitness/format";
import { daysUntil, RACE } from "~/lib/fitness/race";
import { EASY_HR, RUN_BUILD, WEEKLY_TARGETS } from "~/lib/fitness/targets";
import type {
  ActivityKind,
  DashboardData,
  IntradaySeries,
  LoadDay,
  TodayBreakdown,
  ProgressMarker,
  RecoveryMetric,
  Tone,
  WeekActivity,
  WeekData,
} from "~/lib/fitness/types";
import { garmin, GarminError } from "./client.server";
import { easyBandSample } from "./fit.server";

/* ---------------- Response shapes (only the fields we read) ---------------- */

interface DailySummary {
  calendarDate: string;
  wellnessChronology?: { endTimestampLocal?: string };
  heartRate?: { restingValue?: number | null };
  stress?: {
    avgLevel?: number | null;
    maxLevel?: number | null;
    restDurationInMillis?: number | null;
    lowStressDurationInMillis?: number | null;
    mediumStressDurationInMillis?: number | null;
    highStressDurationInMillis?: number | null;
    activityDurationInMillis?: number | null;
    uncategorizedDurationInMillis?: number | null;
  };
  bodyBattery?: { maxValue?: number | null; latestValue?: number | null };
}
interface HrvSummary {
  calendarDate: string;
  weeklyAvg: number | null;
  lastNightAvg: number | null;
  baseline: { balancedLow?: number; balancedUpper?: number } | null;
  status: string;
}
interface SleepSummary {
  calendarDate: string;
  sleepTimeSeconds: number | null;
  deepSleepSeconds?: number | null;
  lightSleepSeconds?: number | null;
  remSleepSeconds?: number | null;
  awakeSleepSeconds?: number | null;
  avgHeartRate?: number | null;
  avgSleepStress?: number | null;
  sleepStartTimestampGMT?: number | null;
  sleepEndTimestampGMT?: number | null;
  sleepScores?: { overall?: { value?: number; qualifierKey?: string } };
}
interface HrvDetail {
  hrvReadings?: { hrvValue: number; readingTimeGMT: string; readingTimeLocal: string }[] | null;
}
interface HeartRateDay {
  heartRateValues?: [number, number | null][] | null;
}
interface BodyBatteryDay {
  date: string;
  bodyBatteryValuesArray?: [number, number | null][] | null;
}
interface Vo2Day {
  generic?: { calendarDate: string; vo2MaxPreciseValue?: number; vo2MaxValue?: number } | null;
}
interface Activity {
  activityId: number;
  activityName?: string;
  startTimeLocal: string; // "2026-11-16 18:45:53"
  activityType?: { typeKey?: string };
  distance?: number | null; // m
  duration?: number | null; // s
  averageSpeed?: number | null; // m/s
  averageHR?: number | null;
  activityTrainingLoad?: number | null;
}
interface WeightRange {
  dailyWeightSummaries?: { summaryDate: string; latestWeight?: { weight?: number | null; calendarDate?: string } | null }[];
}
interface HrZones {
  zone3Floor?: number;
  lactateThresholdHeartRateUsed?: number;
  sport?: string;
}

/* ---------------- Helpers ---------------- */

export const TIME_ZONE = process.env.FITNESS_TIME_ZONE || "Europe/Paris";

/** Calendar arithmetic on YYYY-MM-DD strings (UTC-based, so no DST surprises). */
function addDays(iso: string, n: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
function weekday(iso: string): number {
  return (new Date(`${iso}T00:00:00Z`).getUTCDay() + 6) % 7; // 0 = Monday
}
const mondayOf = (iso: string) => addDays(iso, -weekday(iso));

function localISO(d = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).format(d);
}
function localClock(ms: number): string {
  return new Intl.DateTimeFormat("en-GB", { timeZone: TIME_ZONE, hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(new Date(ms));
}
const fmt = (iso: string, opts: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", ...opts }).format(new Date(`${iso}T00:00:00Z`));
/** "Monday, 16 November 2026" */
const longDateLabel = (iso: string) =>
  `${fmt(iso, { weekday: "long" })}, ${fmt(iso, { day: "numeric" })} ${fmt(iso, { month: "long" })} ${fmt(iso, { year: "numeric" })}`;
const shortMonthDay = (iso: string) => fmt(iso, { day: "numeric", month: "short" });

const num = (v: unknown): v is number => typeof v === "number" && Number.isFinite(v);
const mean = (xs: number[]) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs: number[]) => {
  const m = mean(xs);
  return Math.sqrt(mean(xs.map((x) => (x - m) ** 2)));
};
const r0 = (v: number) => String(Math.round(v));
const hm = (hours: number) => minutesToHM(Math.round(hours * 60));
const mmss = (sec: number) => `${Math.floor(Math.round(sec) / 60)}:${String(Math.round(sec) % 60).padStart(2, "0")}`;

/** Garmin caps some ranges (sleep 31 days), so fetch long ranges in chunks. */
async function chunked<T>(start: string, end: string, days: number, fetch: (s: string, e: string) => Promise<T[]>): Promise<T[]> {
  const out: T[] = [];
  for (let s = start; s <= end; s = addDays(stop(s), 1)) out.push(...((await fetch(s, stop(s))) ?? []));
  return out;
  function stop(s: string) {
    const last = addDays(s, days - 1);
    return last < end ? last : end;
  }
}

/**
 * One value per calendar day from the first day with data through `today`, oldest first.
 * Gaps (a night without the watch) carry the previous value forward so charts stay continuous.
 */
function dailySeries(byDate: Map<string, number>, today: string, maxDays = 90): number[] {
  const out: number[] = [];
  let last: number | undefined;
  for (let i = maxDays - 1; i >= 0; i--) {
    const v = byDate.get(addDays(today, -i));
    if (num(v)) last = v;
    if (last !== undefined) out.push(num(v) ? v : last);
  }
  if (out.length === 1) out.unshift(out[0]); // charts need two points
  return out;
}

function lastN(byDate: Map<string, number>, from: string, n: number): number[] {
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const v = byDate.get(addDays(from, -i));
    if (num(v)) out.push(v);
  }
  return out;
}

const SLOT_MIN = 15;

/**
 * A rolling 24-hour series ending now, on a 15-minute grid (97 slots).
 * - "mean": average the readings in each slot; empty slots stay null (a gap).
 * - "interp": the value moves continuously (Body Battery), so interpolate between readings.
 */
function rolling24h(points: [number, number][], nowMs: number, mode: "mean" | "interp", opts: Partial<IntradaySeries> = {}): IntradaySeries | undefined {
  const slotMs = SLOT_MIN * 60_000;
  const end = Math.floor(nowMs / slotMs) * slotMs;
  const start = end - 24 * 60 * 60_000;
  const n = (end - start) / slotMs + 1;
  const sorted = [...points].sort((a, b) => a[0] - b[0]);
  const values: (number | null)[] = new Array(n).fill(null);
  if (mode === "mean") {
    const sum = new Array(n).fill(0);
    const cnt = new Array(n).fill(0);
    for (const [t, v] of sorted) {
      const i = Math.round((t - start) / slotMs);
      if (i < 0 || i >= n) continue;
      sum[i] += v;
      cnt[i]++;
    }
    for (let i = 0; i < n; i++) if (cnt[i]) values[i] = sum[i] / cnt[i];
  } else {
    const last = sorted[sorted.length - 1];
    for (let i = 0; i < n; i++) {
      const t = start + i * slotMs;
      const k = sorted.findIndex((p) => p[0] >= t);
      if (k === -1) values[i] = last && t - last[0] < 3 * 60 * 60_000 ? last[1] : null; // hold the latest reading up to now
      else if (k === 0) values[i] = sorted[0][0] - t < slotMs ? sorted[0][1] : null;
      else {
        const [t0, v0] = sorted[k - 1];
        const [t1, v1] = sorted[k];
        values[i] = v0 + ((v1 - v0) * (t - t0)) / (t1 - t0 || 1);
      }
    }
  }
  if (values.filter((v) => v !== null).length < 2) return undefined;
  const labels = values.map((_, i) => localClock(start + i * slotMs));
  return { values, labels, start: `${labels[0]} yesterday`, end: "Now", ...opts };
}

function kindOf(typeKey = ""): ActivityKind {
  if (/run/.test(typeKey)) return "run";
  if (/cycl|bik|ride|spin/.test(typeKey)) return "bike";
  if (/swim/.test(typeKey)) return "swim";
  if (/strength|weight/.test(typeKey)) return "gym";
  return "other";
}
const titleCase = (key: string) => key.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase());

/** Swallow "no data" style failures, but let rate limits and auth errors through. */
async function soft<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch (e) {
    const status = (e as GarminError).status;
    if (status === 429 || status === 401 || status === 403) throw e;
    return fallback;
  }
}

interface SlowHistory {
  at: number;
  day: string;
  hrvs: HrvSummary[];
  sleeps: SleepSummary[];
  vo2Res: Vo2Day[];
  zonesRes: HrZones[];
  weightRes: WeightRange | null;
}
const HISTORY_TTL_MS = 30 * 60 * 1000;
let historyCache: SlowHistory | null = null;

async function slowHistory(today: string): Promise<SlowHistory> {
  if (historyCache && historyCache.day === today && Date.now() - historyCache.at < HISTORY_TTL_MS) return historyCache;
  const from90 = addDays(today, -89);
  const [hrvRes, sleeps, vo2Res, zonesRes, weightRes] = await Promise.all([
    garmin.hrvSummaries(from90, today) as Promise<{ hrvSummaries?: HrvSummary[] }>,
    chunked(from90, today, 31, (s, e) => garmin.sleepSummaries(s, e) as Promise<SleepSummary[]>),
    soft(garmin.vo2max(addDays(today, -364), today) as Promise<Vo2Day[]>, []),
    soft(garmin.heartRateZones() as Promise<HrZones[]>, []),
    soft(garmin.weights(addDays(today, -365), today) as Promise<WeightRange | null>, null),
  ]);
  historyCache = { at: Date.now(), day: today, hrvs: hrvRes?.hrvSummaries ?? [], sleeps, vo2Res: vo2Res ?? [], zonesRes: zonesRes ?? [], weightRes };
  return historyCache;
}

/* ---------------- Main ---------------- */

export interface GarminDashboardPart {
  today: string;
  todayLabel: string;
  syncedAt: string;
  watchSyncedAt?: string;
  week: WeekData;
  recovery: RecoveryMetric[];
  recoveryContext: DashboardData["recoveryContext"];
  markers: ProgressMarker[];
  run: DashboardData["run"];
  load: DashboardData["load"];
  fuel: DashboardData["fuel"];
}

const LOAD_DAYS = 120;

export async function fetchGarminPart(): Promise<GarminDashboardPart> {
  const now = new Date();
  const today = localISO(now);
  const yesterday = addDays(today, -1);
  const from90 = addDays(today, -89);
  const monday = mondayOf(today);

  // History that barely changes: fetched at most every 30 minutes.
  const history = await slowHistory(today);
  // Live data: fetched on every sync (9 calls).
  const [summariesRes, hrvRecentRes, sleepToday0, hrvToday, hrvYesterday, hrToday, hrYesterday, bbDays, recentActs] = await Promise.all([
    garmin.dailySummaries(from90, today) as Promise<{ data?: DailySummary[] }>,
    garmin.hrvSummaries(yesterday, today) as Promise<{ hrvSummaries?: HrvSummary[] }>,
    soft(garmin.sleep(today) as Promise<SleepSummary | null>, null),
    soft(garmin.hrv(today) as Promise<HrvDetail | null>, null),
    soft(garmin.hrv(yesterday) as Promise<HrvDetail | null>, null),
    soft(garmin.heartRate(today) as Promise<HeartRateDay | null>, null),
    soft(garmin.heartRate(yesterday) as Promise<HeartRateDay | null>, null),
    soft(garmin.bodyBattery(yesterday, today) as Promise<BodyBatteryDay[]>, []),
    // Everything from the last 120 days: this week, run history and training load
    garmin.activities({ startDate: addDays(today, -LOAD_DAYS), endDate: today, limit: 500 }) as Promise<Activity[]>,
  ]);
  const { vo2Res, zonesRes, weightRes } = history;
  const sleeps = [...history.sleeps.filter((s) => s?.calendarDate !== today), ...(sleepToday0?.calendarDate ? [sleepToday0] : [])];

  const summaries = summariesRes?.data ?? [];
  const acts = (recentActs ?? []).filter((a) => a.startTimeLocal);
  const runs = acts.filter((a) => kindOf(a.activityType?.typeKey) === "run");
  const recentHrv = hrvRecentRes?.hrvSummaries ?? [];
  const hrvs = [...history.hrvs.filter((h) => !recentHrv.some((r) => r.calendarDate === h.calendarDate)), ...recentHrv].sort((a, b) =>
    a.calendarDate.localeCompare(b.calendarDate),
  );
  const zones = (zonesRes ?? []).find((z) => z.sport === "RUNNING") ?? (zonesRes ?? [])[0];

  const rhrBy = new Map<string, number>();
  const stressBy = new Map<string, number>();
  const bbPeakBy = new Map<string, number>();
  for (const d of summaries) {
    if (num(d.heartRate?.restingValue)) rhrBy.set(d.calendarDate, d.heartRate!.restingValue!);
    if (num(d.stress?.avgLevel) && d.stress!.avgLevel! >= 0) stressBy.set(d.calendarDate, d.stress!.avgLevel!);
    if (num(d.bodyBattery?.maxValue)) bbPeakBy.set(d.calendarDate, d.bodyBattery!.maxValue!);
  }
  const hrvBy = new Map<string, number>();
  for (const h of hrvs) if (num(h.lastNightAvg)) hrvBy.set(h.calendarDate, h.lastNightAvg);
  const sleepBy = new Map<string, number>();
  const sleepByDate = new Map<string, SleepSummary>();
  for (const s of sleeps) {
    if (!s?.calendarDate) continue;
    sleepByDate.set(s.calendarDate, s);
    if (num(s.sleepTimeSeconds) && s.sleepTimeSeconds > 0) sleepBy.set(s.calendarDate, s.sleepTimeSeconds / 3600);
  }

  const todaySummary = summaries.find((d) => d.calendarDate === today);
  const latestHrv = [...hrvs].reverse().find((h) => num(h.lastNightAvg));
  const lastSleep = sleepByDate.get(today) ?? sleepByDate.get(yesterday);

  /* ----- HRV: last night is the current value ----- */
  const hrvNights = lastN(hrvBy, today, 60);
  const hrvLast = latestHrv?.lastNightAvg;
  const hrv7 = lastN(hrvBy, today, 7);
  const hrv7Avg = latestHrv?.weeklyAvg ?? (hrv7.length ? mean(hrv7) : NaN);
  const garminBand: [number, number] | null =
    latestHrv?.baseline && num(latestHrv.baseline.balancedLow) && num(latestHrv.baseline.balancedUpper)
      ? [latestHrv.baseline.balancedLow, latestHrv.baseline.balancedUpper]
      : null;
  const hrvProvisional: [number, number] =
    hrvNights.length >= 3 ? [Math.round(mean(hrvNights) - Math.max(sd(hrvNights), 1)), Math.round(mean(hrvNights) + Math.max(sd(hrvNights), 1))] : [40, 80];
  const hrvBand = garminBand ?? hrvProvisional;
  const hrvState = hrvStatusLabel(latestHrv?.status, hrvNights.length);

  /* ----- Resting HR: today's value ----- */
  const rhrToday = rhrBy.get(today) ?? lastN(rhrBy, today, 3)[0];
  const rhrHistory = lastN(rhrBy, yesterday, 30);
  const rhrBase = rhrHistory.length ? mean(rhrHistory) : rhrToday;
  const rhrBand: [number, number] = [Math.round(rhrBase - 3), Math.round(rhrBase + 3)];
  const rhrDelta = num(rhrToday) && num(rhrBase) ? rhrToday - rhrBase : 0;
  const rhrState: { status: string; tone: Tone } =
    rhrDelta >= 5 ? { status: "Elevated", tone: "bad" } : rhrDelta >= 3 ? { status: "A bit high", tone: "warn" } : { status: "At baseline", tone: "good" };

  /* ----- Sleep: last night ----- */
  const sleepH = lastSleep && num(lastSleep.sleepTimeSeconds) ? lastSleep.sleepTimeSeconds / 3600 : NaN;
  const sleep7 = lastN(sleepBy, today, 7);
  const sleepScore = lastSleep?.sleepScores?.overall;
  const sleepState = sleepQualifier(sleepScore?.qualifierKey, sleepH);

  /* ----- Body Battery: the live level ----- */
  const bbNow = todaySummary?.bodyBattery?.latestValue;
  const bbPeak = bbPeakBy.get(today);
  const bbState: { status: string; tone: Tone } = !num(bbNow)
    ? { status: "No data", tone: "neutral" }
    : bbNow >= 75
      ? { status: "High", tone: "good" }
      : bbNow >= 50
        ? { status: "Medium", tone: "neutral" }
        : bbNow >= 26
          ? { status: "Low", tone: "neutral" }
          : { status: "Very low", tone: "warn" };
  // The daily series ends with the live level so the sparkline matches the tile.
  const bbSeriesBy = new Map(bbPeakBy);
  if (num(bbNow)) bbSeriesBy.set(today, bbNow);

  /* ----- Stress: today so far ----- */
  const stressNow = stressBy.get(today);
  const stressYesterday = stressBy.get(yesterday);
  const stressValue = stressNow ?? stressYesterday;
  const stressState: { status: string; tone: Tone } = !num(stressValue)
    ? { status: "No data", tone: "neutral" }
    : stressValue <= 25
      ? { status: "Low", tone: "good" }
      : stressValue <= 50
        ? { status: "Moderate", tone: "neutral" }
        : { status: "High", tone: "warn" };

  /* ----- Rolling 24 hours, ending now ----- */
  const nowMs = now.getTime();
  const gmt = (v: string) => Date.parse(`${v.replace(/\.\d+$/, "")}Z`);
  const hrvPoints: [number, number][] = [...(hrvYesterday?.hrvReadings ?? []), ...(hrvToday?.hrvReadings ?? [])]
    .filter((r) => num(r.hrvValue) && r.readingTimeGMT)
    .map((r) => [gmt(r.readingTimeGMT), r.hrvValue]);
  const hrPoints = [...(hrYesterday?.heartRateValues ?? []), ...(hrToday?.heartRateValues ?? [])].filter((p): p is [number, number] => num(p[0]) && num(p[1]));
  const bbPoints = (bbDays ?? []).flatMap((d) => d.bodyBatteryValuesArray ?? []).filter((p): p is [number, number] => num(p[0]) && num(p[1]));
  const hrvIntraday = rolling24h(hrvPoints, nowMs, "mean", { caption: "Overnight HRV" });
  const hrIntraday = rolling24h(hrPoints, nowMs, "mean", { caption: "Heart rate" });
  const bbIntraday = rolling24h(bbPoints, nowMs, "interp", { min: 0, max: 100, caption: "Body Battery" });
  const sleepToday = sleepBreakdown(lastSleep, nowMs, sleepScore?.value);
  const stressToday = stressBreakdown(todaySummary?.stress);

  const recovery: RecoveryMetric[] = [
    {
      id: "hrv",
      name: "HRV",
      unit: "ms",
      value: num(hrvLast) ? r0(hrvLast) : "–",
      sub: `Last night${num(hrv7Avg) ? ` · 7-day avg ${r0(hrv7Avg)}` : ""}`,
      status: hrvState.status,
      tone: hrvState.tone,
      band: hrvBand,
      bandLabel: garminBand ? `Garmin baseline ${hrvBand[0]}–${hrvBand[1]} ms` : `Building baseline · ${Math.min(hrvNights.length, 19)} of 19 nights`,
      spread: hrvNights.length > 2 ? Math.max(3, sd(hrvNights)) : 6,
      format: "ms",
      daily: dailySeries(hrvBy, today),
      intraday: hrvIntraday,
      read: "Compare the 7-day average with your own baseline band. A single low night is noise, and absolute numbers mean little between people.",
      rule: "Below the band for 3+ days: swap intensity for Zone 2 and protect sleep. Well above the band can also mean fatigue, not freshness.",
      evidence: "A 2021 meta-analysis found HRV-guided plans beat fixed plans only by a small margin; their real win is fewer athletes going backwards.",
    },
    {
      id: "rhr",
      name: "Resting HR",
      unit: "bpm",
      value: num(rhrToday) ? r0(rhrToday) : "–",
      sub: num(rhrBase) ? `Today · baseline ${r0(rhrBase)} ± 3` : "Today",
      status: rhrState.status,
      tone: rhrState.tone,
      band: rhrBand,
      bandLabel: `Your baseline ${rhrBand[0]}–${rhrBand[1]} bpm`,
      spread: rhrHistory.length > 2 ? Math.max(1.5, sd(rhrHistory)) : 2.2,
      format: "bpm",
      daily: dailySeries(rhrBy, today),
      intraday: hrIntraday,
      read: "Your overnight resting heart rate against your baseline.",
      rule: "5+ bpm above baseline for 2 mornings with HRV down: easy day. Think illness, heat, alcohol or life stress first.",
      evidence: "Resting HR and HRV come from the same beat-to-beat signal and track each other closely, so treat it as confirmation, not a second vote.",
    },
    {
      id: "sleep",
      name: "Sleep",
      unit: "",
      value: num(sleepH) ? hm(sleepH) : "–",
      sub: `Last night${num(sleepScore?.value) ? ` · score ${sleepScore!.value}` : ""}${sleep7.length > 1 ? ` · ${sleep7.length}-night avg ${hm(mean(sleep7))}` : ""}`,
      status: sleepState.status,
      tone: sleepState.tone,
      band: [7.5, 9],
      bandLabel: "Target 7.5–9 h",
      spread: 0.55,
      format: "hours",
      daily: dailySeries(sleepBy, today),
      // Garmin's API has stage totals but no stage timeline, so "Today" is a breakdown, not a line.
      todayBreakdown: sleepToday,
      read: "Duration first, consistency second, the score third.",
      rule: "Aim for 8 hours, with bedtime within 30 minutes of usual. Two short nights before a key session: move the session.",
      evidence: "In young athletes, sleeping under 8 hours was linked to about 1.7× the injury rate. Sleep extension improved performance in college basketball players.",
    },
    {
      id: "bb",
      name: "Body Battery",
      unit: "",
      value: num(bbNow) ? r0(bbNow) : "–",
      sub: `Now${num(bbPeak) ? ` · peaked at ${bbPeak} today` : ""}`,
      status: bbState.status,
      tone: bbState.tone,
      band: [60, 100],
      bandLabel: "Daily peaks · typical 60–100",
      spread: 11,
      format: "score",
      daily: dailySeries(bbSeriesBy, today),
      intraday: bbIntraday,
      read: "The live number drains through the day. Judge recovery by the morning peak.",
      rule: "Context only. Never the reason to go hard.",
      evidence: "Body Battery is built from HRV, stress and sleep. In one analytics platform’s data it tracked overnight HRV and sleep score closely (median r ≈ 0.67–0.68), so it adds little on its own.",
    },
    {
      id: "stress",
      name: "Stress",
      unit: "",
      value: num(stressValue) ? r0(stressValue) : "–",
      sub: num(stressNow) ? `Today so far${num(stressYesterday) ? ` · yesterday ${r0(stressYesterday)}` : ""}` : "Yesterday’s average",
      status: stressState.status,
      tone: stressState.tone,
      band: [0, 35],
      bandLabel: "Low 0–35",
      spread: 7,
      format: "score",
      daily: dailySeries(stressBy, today),
      // Garmin's API reports stress as daily totals per level, not a timeline.
      todayBreakdown: stressToday,
      read: "The weekly trend of daily averages. Exercise raises it too.",
      rule: "Several high-stress days in a row: keep intensity modest and protect sleep.",
      evidence: "All-day stress scores barely matched how stressed people said they felt in a study of about 800 young adults. Overnight measures hold up better.",
    },
  ];

  /* ----- This week ----- */
  const activities: WeekActivity[] = acts
    .filter((a) => a.startTimeLocal?.slice(0, 10) >= monday && a.startTimeLocal.slice(0, 10) <= today)
    .map((a) => {
      const kind = kindOf(a.activityType?.typeKey);
      const km = num(a.distance) && a.distance > 0 ? a.distance / 1000 : null;
      const speed = num(a.averageSpeed) && a.averageSpeed > 0 ? a.averageSpeed : null;
      return {
        id: String(a.activityId),
        day: weekday(a.startTimeLocal.slice(0, 10)),
        kind,
        title: a.activityName?.trim() || titleCase(a.activityType?.typeKey ?? "Activity"),
        time: a.startTimeLocal.slice(11, 16),
        distanceKm: km,
        durationMin: num(a.duration) ? a.duration / 60 : 0,
        avgHr: num(a.averageHR) ? Math.round(a.averageHR) : null,
        paceSecPerKm: kind === "run" && speed ? 1000 / speed : null,
        speedKmh: kind === "bike" && speed ? speed * 3.6 : null,
      };
    })
    .sort((a, b) => a.day - b.day || a.time.localeCompare(b.time));
  const sunday = addDays(monday, 6);
  const week: WeekData = {
    start: monday,
    title: "This week",
    sub: `${fmt(monday, { weekday: "short", day: "numeric" })} – ${fmt(sunday, { weekday: "short", day: "numeric", month: "short" })} · from Garmin`,
    todayIndex: weekday(today),
    activities,
    targets: WEEKLY_TARGETS,
  };

  /* ----- Progress markers ----- */
  const markers: ProgressMarker[] = [
    buildVo2Marker(vo2Res ?? [], today),
    {
      id: "thr",
      label: "Threshold",
      empty: {
        title: "Not shared by Garmin",
        text: `Garmin’s Personal API doesn’t include lactate-threshold pace.${
          num(zones?.lactateThresholdHeartRateUsed) ? ` Your heart-rate zones use a threshold HR of ${zones!.lactateThresholdHeartRateUsed} bpm.` : ""
        }`,
      },
    },
    await buildEasyPaceMarker(runs, today),
    {
      id: "css",
      label: "Swim CSS",
      empty: { title: "No swims yet", text: "Once swimming starts, a CSS test (400 m then 200 m, both all-out with full rest) sets your swim zones." },
    },
    {
      id: "ftp",
      label: "Bike FTP",
      empty: { title: "Needs a power meter", text: "Your rides have no power data, so there is no measured FTP. Bike zones come from heart rate until then." },
    },
  ];

  return {
    today,
    todayLabel: longDateLabel(today),
    // The page pulls from Garmin on every load, so "synced" is now.
    syncedAt: localClock(now.getTime()),
    watchSyncedAt: todaySummary?.wellnessChronology?.endTimestampLocal?.slice(11, 16),
    week,
    recovery,
    recoveryContext: {
      hrv7: num(hrv7Avg) ? Math.round(hrv7Avg) : 0,
      hrvBand,
      rhrNote: `RHR ${rhrState.status.toLowerCase()}`,
      sleepNote: num(sleepH) ? `${hm(sleepH)} sleep` : "no sleep data",
    },
    markers,
    run: buildRunData(runs, today, monday),
    fuel: buildFuel(weightRes, acts, today),
    load: buildLoad(acts, today),
  };
}

function hrvStatusLabel(status: string | undefined, nights: number): { status: string; tone: Tone } {
  switch (status) {
    case "BALANCED":
      return { status: "Balanced", tone: "good" };
    case "UNBALANCED":
      return { status: "Unbalanced", tone: "warn" };
    case "LOW":
      return { status: "Low", tone: "warn" };
    case "POOR":
      return { status: "Poor", tone: "bad" };
    default:
      return { status: nights < 19 ? "Onboarding" : "No status", tone: "neutral" };
  }
}

function sleepQualifier(key: string | undefined, hours: number): { status: string; tone: Tone } {
  switch (key) {
    case "EXCELLENT":
      return { status: "Excellent", tone: "good" };
    case "GOOD":
      return { status: "Good", tone: "good" };
    case "FAIR":
      return { status: "Fair", tone: "warn" };
    case "POOR":
      return { status: "Poor", tone: "bad" };
    default:
      if (!num(hours)) return { status: "No data", tone: "neutral" };
      return hours >= 7.5 ? { status: "Good", tone: "good" } : { status: "Short", tone: "warn" };
  }
}

/** Weekly values from `byWeek` (Monday → value), carried forward through empty weeks. */
function weeklySeries(byWeek: Map<string, number>, today: string): { values: number[]; start: string } | null {
  const weeks = [...byWeek.keys()].sort();
  if (!weeks.length) return null;
  const values: number[] = [];
  let last = byWeek.get(weeks[0])!;
  for (let wk = weeks[0]; wk <= today; wk = addDays(wk, 7)) {
    if (byWeek.has(wk)) last = byWeek.get(wk)!;
    values.push(last);
  }
  // One week of data still needs two points to draw.
  if (values.length === 1) return { values: [values[0], values[0]], start: addDays(weeks[0], -7) };
  return { values, start: weeks[0] };
}

function buildVo2Marker(rows: Vo2Day[], today: string): ProgressMarker {
  const byDate = new Map<string, number>();
  for (const v of rows) {
    const g = v?.generic;
    const val = g?.vo2MaxPreciseValue ?? g?.vo2MaxValue;
    if (g?.calendarDate && num(val)) byDate.set(g.calendarDate, val);
  }
  const dates = [...byDate.keys()].sort();
  if (!dates.length) {
    return { id: "vo2", label: "VO₂ max", empty: { title: "No VO₂ max yet", text: "Garmin estimates VO₂ max after a few outdoor runs with heart rate and GPS." } };
  }
  const byWeek = new Map<string, number>();
  for (const d of dates) byWeek.set(mondayOf(d), byDate.get(d)!);
  const series = weeklySeries(byWeek, today)!;
  const first = byDate.get(dates[0])!;
  const latest = byDate.get(dates[dates.length - 1])!;
  const diff = Math.round(latest) - Math.round(first);
  return {
    id: "vo2",
    label: "VO₂ max",
    values: series.values,
    startDate: series.start,
    step: true,
    format: "vo2",
    value: String(Math.round(latest)),
    unit: "ml/kg/min",
    change: dates.length > 1 && diff !== 0 ? `${diff > 0 ? "+" : "−"}${Math.abs(diff)} since ${shortMonthDay(dates[0])}` : `Since ${shortMonthDay(dates[0])}`,
    note: "Trend only. Wrist estimates often sit 5–10% off a lab test, so watch the direction, not the number.",
  };
}

/**
 * Easy pace: running pace while HR sits in EASY_HR (top of zone 2), from each run's FIT file.
 * Walking and standing are excluded. Weekly values are time-weighted across that week's runs.
 */
async function buildEasyPaceMarker(runs: Activity[], today: string): Promise<ProgressMarker> {
  const recent = runs.filter((a) => a.startTimeLocal.slice(0, 10) >= addDays(today, -84)); // 12 weeks
  const samples = await Promise.all(
    recent.map(async (a) => ({ a, s: await easyBandSample(a.activityId).catch(() => null) })),
  );
  const MIN_SECONDS = 60;
  const usable = samples.filter((x): x is { a: Activity; s: NonNullable<typeof x.s> } => !!x.s && x.s.seconds >= MIN_SECONDS);
  const band = `${EASY_HR.low}–${EASY_HR.high} bpm`;
  if (!usable.length) {
    return {
      id: "eff",
      label: "Easy pace",
      empty: { title: "Not enough running in the band yet", text: `Easy pace is your running pace at ${band}, the top of zone 2. It needs at least a minute of running in that band.` },
    };
  }
  const agg = new Map<string, { sec: number; speedSec: number; hrSec: number }>();
  for (const { a, s: smp } of usable) {
    const wk = mondayOf(a.startTimeLocal.slice(0, 10));
    const cur = agg.get(wk) ?? { sec: 0, speedSec: 0, hrSec: 0 };
    cur.sec += smp.seconds;
    cur.speedSec += smp.speed * smp.seconds;
    cur.hrSec += smp.hr * smp.seconds;
    agg.set(wk, cur);
  }
  const byWeek = new Map([...agg].map(([wk, v]) => [wk, 1000 / (v.speedSec / v.sec)]));
  const series = weeklySeries(byWeek, today)!;
  const lastWeek = [...agg.keys()].sort().pop()!;
  const last = agg.get(lastWeek)!;
  const minutes = Math.round(usable.reduce((t, x) => t + x.s.seconds, 0) / 60);
  return {
    id: "eff",
    label: "Easy pace",
    values: series.values,
    startDate: series.start,
    invert: true,
    format: "pace-hr",
    value: mmss(byWeek.get(lastWeek)!),
    unit: `/km at ${Math.round(last.hrSec / last.sec)} bpm`,
    change: `${usable.length} run${usable.length === 1 ? "" : "s"} · ${minutes} min at ${band}`,
    note: `Your pace while heart rate sits at ${band}, the top of zone 2, from each run’s second-by-second data. Walking breaks don’t count. Faster at the same heart rate means your aerobic base is growing.`,
  };
}

/** Weekly running volume from Garmin, starting with the first week you ran. */
function buildRunData(runs: Activity[], today: string, monday: string): DashboardData["run"] {
  const km = (a: Activity) => (num(a.distance) ? a.distance / 1000 : 0);
  const firstRunWeek = runs.length ? mondayOf(runs.map((a) => a.startTimeLocal.slice(0, 10)).sort()[0]) : monday;
  const history: DashboardData["run"]["history"] = [];
  for (let wk = firstRunWeek; wk < monday; wk = addDays(wk, 7)) {
    const ws = runs.filter((a) => mondayOf(a.startTimeLocal.slice(0, 10)) === wk);
    history.push({ km: round1(ws.reduce((t, a) => t + km(a), 0)), longRun: round1(Math.max(0, ...ws.map(km))), phase: ws.length ? "Done" : "No runs" });
  }
  const thisWeek = runs.filter((a) => a.startTimeLocal.slice(0, 10) >= monday);
  const longest30 = Math.max(0, ...runs.filter((a) => a.startTimeLocal.slice(0, 10) > addDays(today, -30)).map(km));
  return {
    historyStart: firstRunWeek,
    history,
    currentLongRun: round1(Math.max(0, ...thisWeek.map(km))),
    ahead: [],
    rebuildFrom: WEEKLY_TARGETS.run.amount,
    peak: RUN_BUILD.peak,
    target: RUN_BUILD.target,
    targetLabel: RUN_BUILD.targetLabel,
    singleRunCap: round1(longest30 * (1 + RUN_BUILD.singleRunJump)),
    tolerance: 0,
    impactLoad: 0,
    easyDriftPct: 0,
    longestThisWeek: round1(Math.max(0, ...thisWeek.map(km))),
    longest30: round1(longest30),
    horizon: RUN_BUILD.horizon,
  };
}

/**
 * Fitness (42-day) and fatigue (7-day) from Garmin's per-activity training load,
 * the same exponentially weighted model as CTL/ATL. Form is yesterday's fitness minus fatigue.
 * Shows from a week before the first meaningful session (4–13 weeks) through today; nothing is projected.
 */
function buildLoad(acts: Activity[], today: string): DashboardData["load"] {
  const loadBy = new Map<string, number>();
  for (const a of acts) {
    const d = a.startTimeLocal.slice(0, 10);
    if (num(a.activityTrainingLoad)) loadBy.set(d, (loadBy.get(d) ?? 0) + a.activityTrainingLoad);
  }
  const first = addDays(today, -(LOAD_DAYS - 1));
  const days: LoadDay[] = [];
  const daily: number[] = [];
  let fitness = 0;
  let fatigue = 0;
  for (let d = first; d <= today; d = addDays(d, 1)) {
    const tl = loadBy.get(d) ?? 0;
    const form = fitness - fatigue;
    fitness += (tl - fitness) / 42;
    fatigue += (tl - fatigue) / 7;
    days.push({ fitness, fatigue, form });
    daily.push(tl);
  }
  // Skip the long flat stretch before training started (rides without HR log ~1 load).
  const firstReal = daily.findIndex((tl) => tl >= 5);
  const fromFirst = firstReal === -1 ? 28 : days.length - firstReal + 7;
  const SHOW = Math.min(90, Math.max(28, fromFirst));
  const startIdx = days.length - SHOW;
  return {
    days: days.slice(startIdx),
    dailyLoad: daily.slice(startIdx),
    startDate: addDays(first, startIdx),
    todayIndex: SHOW - 1,
    raceIndex: SHOW - 1 + daysUntil(RACE.date, today),
    raceLabel: `${RACE.name} · ${shortMonthDay(RACE.date)}`,
    projected: false,
  };
}

const SHADES = { strongest: 1, strong: 0.72, mid: 0.48, faint: 0.26, faintest: 0.12 };

/** Last night's sleep: stage totals, and where the sleep window sits in the last 24 hours. */
function sleepBreakdown(s: SleepSummary | undefined, nowMs: number, score: number | undefined): TodayBreakdown | undefined {
  if (!s || !num(s.sleepTimeSeconds) || s.sleepTimeSeconds <= 0) return undefined;
  const min = (sec: number | null | undefined) => (num(sec) ? Math.round(sec / 60) : 0);
  const dayStart = nowMs - 24 * 60 * 60_000;
  const frac = (t: number) => Math.min(1, Math.max(0, (t - dayStart) / (24 * 60 * 60_000)));
  const start = s.sleepStartTimestampGMT;
  const end = s.sleepEndTimestampGMT;
  return {
    caption: "Last night’s sleep",
    segments: [
      { key: "deep", label: "Deep", minutes: min(s.deepSleepSeconds), shade: SHADES.strongest },
      { key: "rem", label: "REM", minutes: min(s.remSleepSeconds), shade: SHADES.strong },
      { key: "light", label: "Light", minutes: min(s.lightSleepSeconds), shade: SHADES.mid },
      { key: "awake", label: "Awake", minutes: min(s.awakeSleepSeconds), shade: SHADES.faint },
    ],
    window:
      num(start) && num(end)
        ? { from: frac(start), to: frac(end), fromLabel: localClock(start), toLabel: localClock(end), startLabel: `${localClock(dayStart)} yesterday`, endLabel: "Now" }
        : undefined,
    stats: [
      { label: "Asleep", value: hm(s.sleepTimeSeconds / 3600) },
      { label: "Sleep score", value: num(score) ? String(score) : "–" },
      { label: "Avg HR asleep", value: num(s.avgHeartRate) ? `${Math.round(s.avgHeartRate)} bpm` : "–" },
    ],
    note: "Garmin shares the time in each stage, not when each stage happened, so the stages are shown as totals.",
  };
}

/** Today's stress, as time at each level since midnight (Garmin reports stress per calendar day). */
function stressBreakdown(st: DailySummary["stress"]): TodayBreakdown | undefined {
  if (!st || !num(st.avgLevel) || st.avgLevel < 0) return undefined;
  const min = (ms: number | null | undefined) => (num(ms) ? Math.round(ms / 60_000) : 0);
  const segments = [
    { key: "rest", label: "Rest", minutes: min(st.restDurationInMillis), shade: SHADES.faint },
    { key: "low", label: "Low", minutes: min(st.lowStressDurationInMillis), shade: SHADES.mid },
    { key: "medium", label: "Medium", minutes: min(st.mediumStressDurationInMillis), shade: SHADES.strong },
    { key: "high", label: "High", minutes: min(st.highStressDurationInMillis), shade: SHADES.strongest },
    { key: "activity", label: "Activity", minutes: min(st.activityDurationInMillis), shade: SHADES.faintest },
  ];
  const measured = segments.reduce((t, x) => t + x.minutes, 0);
  return {
    caption: "Stress today, since midnight",
    segments,
    stats: [
      { label: "Average", value: String(Math.round(st.avgLevel)) },
      { label: "Peak", value: num(st.maxLevel) ? String(st.maxLevel) : "–" },
      { label: "Measured", value: minutesToHM(measured) },
    ],
    note: "Garmin reports stress as time at each level per day, not as a timeline, so this covers today since midnight. Time during workouts counts as activity, not stress.",
  };
}

/** Body weight from Garmin, and how much training is recorded today. */
function buildFuel(w: WeightRange | null, acts: Activity[], today: string): DashboardData["fuel"] {
  const latest = (w?.dailyWeightSummaries ?? [])
    .filter((d) => num(d.latestWeight?.weight))
    .sort((a, b) => b.summaryDate.localeCompare(a.summaryDate))[0];
  const minutesToday = acts.filter((a) => a.startTimeLocal.slice(0, 10) === today).reduce((t, a) => t + (num(a.duration) ? a.duration / 60 : 0), 0);
  return {
    weightKg: latest ? Math.round((latest.latestWeight!.weight! / 1000) * 10) / 10 : 75,
    weightSource: latest ? `Garmin · ${shortMonthDay(latest.summaryDate)}` : "Not in Garmin, assumed",
    // Meals aren't logged in Garmin; phase 2 brings them in from Apple Health.
    eaten: null,
    trainingMinutesToday: Math.round(minutesToday),
  };
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}

/* ---------------- Entry point for the route ---------------- */

/** A page refresh re-syncs, but never more than once a minute (Garmin rate-limits the API). */
const MIN_SYNC_GAP_MS = 60 * 1000;
/** After a 429, leave Garmin alone for this long. */
const RATE_LIMIT_BACKOFF_MS = 2 * 60 * 1000;

let lastGood: { at: number; part: GarminDashboardPart } | null = null;
let inflight: Promise<GarminDashboardPart> | null = null;
let blockedUntil = 0;

async function syncGarmin(): Promise<{ part: GarminDashboardPart; status: NonNullable<DashboardData["syncStatus"]> }> {
  const now = Date.now();
  if (lastGood && now - lastGood.at < MIN_SYNC_GAP_MS) return { part: lastGood.part, status: { state: "fresh" } };
  if (now < blockedUntil) {
    if (lastGood) return { part: lastGood.part, status: { state: "stale", reason: "Garmin is rate-limiting requests" } };
    throw new GarminError("Garmin is rate-limiting requests", 429);
  }
  try {
    inflight ??= fetchGarminPart().finally(() => {
      inflight = null;
    });
    const part = await inflight;
    lastGood = { at: Date.now(), part };
    return { part, status: { state: "fresh" } };
  } catch (e) {
    const err = e as GarminError;
    if (err.status === 429) blockedUntil = Date.now() + RATE_LIMIT_BACKOFF_MS;
    console.error("[fitness] Garmin sync failed:", err.message);
    if (lastGood) {
      return { part: lastGood.part, status: { state: "stale", reason: err.status === 429 ? "Garmin is rate-limiting requests" : "Couldn’t reach Garmin" } };
    }
    throw e;
  }
}

/** The full dashboard: Garmin data (re-synced on load), sample data only for fields phase 1 doesn't show. */
export async function getDashboard(): Promise<DashboardData> {
  const data = getSampleDashboard();
  let g: GarminDashboardPart;
  let syncStatus: NonNullable<DashboardData["syncStatus"]>;
  try {
    ({ part: g, status: syncStatus } = await syncGarmin());
  } catch (e) {
    return {
      ...data,
      block: { ...data.block, race: RACE.name, daysToRace: daysUntil(RACE.date, localISO()) },
      source: "sample",
      sourceError: (e as Error).message,
      syncStatus: { state: "stale", reason: (e as Error).message },
    };
  }
  return {
    ...data,
    today: g.today,
    todayLabel: g.todayLabel,
    syncedAt: g.syncedAt,
    watchSyncedAt: g.watchSyncedAt,
    block: { ...data.block, race: RACE.name, daysToRace: daysUntil(RACE.date, g.today) },
    week: g.week,
    recovery: g.recovery,
    recoveryContext: g.recoveryContext,
    markers: g.markers,
    run: g.run,
    load: g.load,
    fuel: g.fuel,
    source: "garmin",
    syncStatus,
  };
}
