/**
 * Second-by-second run data from the original FIT file, which the Personal API serves
 * as a ZIP. Used for "easy pace": pace while heart rate sits at the top of zone 2.
 *
 * Activities don't change after upload, so results are cached in memory by activity id.
 */
import { unzipSync } from "fflate";
import FitParser from "fit-file-parser";
import { EASY_HR } from "~/lib/fitness/targets";
import { downloadActivityFit } from "./client.server";

/** Slower than this (m/s ≈ 8:46 /km) is walking or standing, even if HR is still up. */
const MIN_RUN_SPEED = 1.9;

export interface EasyBandSample {
  /** Seconds spent running with HR inside EASY_HR */
  seconds: number;
  /** Mean speed (m/s) over those seconds */
  speed: number;
  /** Mean HR over those seconds */
  hr: number;
}

interface FitRecord {
  timestamp?: Date;
  heart_rate?: number;
  speed?: number;
  enhanced_speed?: number;
}

const cache = new Map<string, EasyBandSample | null>();

function parseFit(bytes: Uint8Array): Promise<FitRecord[]> {
  return new Promise((resolve, reject) => {
    const parser = new FitParser({ force: true, speedUnit: "m/s", lengthUnit: "m", mode: "list" });
    parser.parse(Buffer.from(bytes), (err: unknown, data: { records?: FitRecord[] }) => (err ? reject(err) : resolve(data?.records ?? [])));
  });
}

export async function easyBandSample(activityId: number | string): Promise<EasyBandSample | null> {
  const key = String(activityId);
  if (cache.has(key)) return cache.get(key)!;

  const files = unzipSync(await downloadActivityFit(activityId));
  const name = Object.keys(files).find((n) => n.toLowerCase().endsWith(".fit"));
  if (!name) {
    cache.set(key, null);
    return null;
  }
  const records = await parseFit(files[name]);

  let seconds = 0;
  let speedSum = 0;
  let hrSum = 0;
  for (let i = 0; i < records.length; i++) {
    const r = records[i];
    const hr = r.heart_rate;
    const speed = r.enhanced_speed ?? r.speed;
    if (hr === undefined || speed === undefined || hr < EASY_HR.low || hr > EASY_HR.high || speed < MIN_RUN_SPEED) continue;
    // Smart recording spaces records unevenly: weight each by the gap to the next one (max 10 s).
    const t = r.timestamp?.getTime();
    const next = records[i + 1]?.timestamp?.getTime();
    const dt = t !== undefined && next !== undefined ? Math.min(10, Math.max(1, (next - t) / 1000)) : 1;
    seconds += dt;
    speedSum += speed * dt;
    hrSum += hr * dt;
  }
  const sample = seconds > 0 ? { seconds, speed: speedSum / seconds, hr: hrSum / seconds } : null;
  cache.set(key, sample);
  return sample;
}
