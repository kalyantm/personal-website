/**
 * Dump one sample of every Garmin Personal API endpoint the dashboard uses, so the
 * mapping onto DashboardData can be written against real response shapes.
 *
 *   node --require esbuild-register scripts/garmin-probe.ts <out-dir>
 *
 * Reads GARMIN_PERSONAL_API_KEY from the environment (or .env).
 */
import fs from "fs";
import path from "path";
import { garmin } from "../app/lib/garmin/client.server";

function loadDotEnv() {
  const file = path.join(__dirname, "..", ".env");
  if (!fs.existsSync(file)) return;
  for (const line of fs.readFileSync(file, "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
}

const iso = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => iso(new Date(Date.now() - n * 86_400_000));

async function main() {
  loadDotEnv();
  const out = process.argv[2];
  if (!out) throw new Error("usage: garmin-probe.ts <out-dir>");
  fs.mkdirSync(out, { recursive: true });
  const today = daysAgo(0);
  const yesterday = daysAgo(1);

  const calls: Record<string, () => Promise<unknown>> = {
    dailySummaries: () => garmin.dailySummaries(daysAgo(6), today),
    hrvSummaries: () => garmin.hrvSummaries(daysAgo(6), today),
    hrv: () => garmin.hrv(yesterday),
    sleepSummaries: () => garmin.sleepSummaries(daysAgo(6), today),
    sleep: () => garmin.sleep(today),
    bodyBattery: () => garmin.bodyBattery(daysAgo(2), today),
    stress: () => garmin.stress(daysAgo(6), today),
    heartRate: () => garmin.heartRate(yesterday),
    vo2max: () => garmin.vo2max(daysAgo(180), today),
    activities: () => garmin.activities({ limit: 15 }),
    profileSettings: () => garmin.profileSettings(),
    heartRateZones: () => garmin.heartRateZones(),
  };

  for (const [name, call] of Object.entries(calls)) {
    try {
      const data = await call();
      fs.writeFileSync(path.join(out, `${name}.json`), JSON.stringify(data, null, 2));
      console.log(`ok    ${name}`);
    } catch (e) {
      console.log(`fail  ${name}: ${(e as Error).message}`);
    }
  }

  // One full activity, for training load / notes / laps
  try {
    const list = JSON.parse(fs.readFileSync(path.join(out, "activities.json"), "utf8"));
    const first = Array.isArray(list) ? list[0] : list?.activityList?.[0] ?? list?.activities?.[0];
    if (first?.activityId) {
      fs.writeFileSync(path.join(out, "activity.json"), JSON.stringify(await garmin.activity(first.activityId), null, 2));
      console.log("ok    activity");
    }
  } catch (e) {
    console.log(`fail  activity: ${(e as Error).message}`);
  }
}

main().catch((e) => {
  console.error(e.message);
  process.exit(1);
});
