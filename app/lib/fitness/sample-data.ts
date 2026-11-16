/**
 * Sample data shaped exactly like the dashboard expects once Garmin is wired up.
 * Replace getSampleDashboard() with a loader that maps the Garmin Personal API
 * and intervals.icu responses onto DashboardData. Everything here is plain JSON,
 * so it can be passed from a server component to the client dashboard.
 */
import { WEEKLY_TARGETS } from "./targets";
import type { DashboardData, IntradaySeries, LoadDay, MetricId, ProgressMarker, RecoveryMetric, Session } from "./types";

function rng(seed: number): () => number {
  let s = (seed * 9301 + 49297) % 233280;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function clock(startMin: number, i: number, step: number): string {
  const t = (startMin + i * step) % 1440;
  return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
}

function daily(idx: number, mean: number, amp: number, last: number): number[] {
  const r = rng(idx * 17 + 5);
  const out: number[] = [];
  let v = mean;
  for (let i = 0; i < 90; i++) {
    const target = mean + amp * (r() - 0.5) * 1.6 + amp * 0.35 * Math.sin(i / 4 + idx);
    v = v * 0.5 + target * 0.5;
    out.push(v);
  }
  for (let j = 0; j <= 4; j++) {
    const i = 89 - j;
    const w = 1 - j / 5;
    out[i] = out[i] * (1 - w) + last * w;
  }
  return out;
}

function intraday(id: MetricId): IntradaySeries {
  const r = rng(id.length * 31 + 7);
  const values: number[] = [];
  const labels: string[] = [];
  if (id === "hrv" || id === "rhr") {
    for (let i = 0; i < 90; i++) {
      const s = Math.sin((Math.PI * i) / 89);
      values.push(id === "hrv" ? 49 + 13 * s + 6 * (r() - 0.5) : 55.5 - 6.5 * s + 1.8 * (r() - 0.5));
      labels.push(clock(23 * 60 + 30, i, 5));
    }
    return { values, labels, start: "23:30", end: "07:00" };
  }
  if (id === "sleep") {
    // [stage, minutes] — 4 Awake, 3 REM, 2 Light, 1 Deep
    const plan: [number, number][] = [[4, 5], [2, 20], [1, 40], [2, 15], [3, 10], [2, 20], [1, 30], [2, 20], [3, 20], [2, 25], [1, 15], [2, 20], [3, 30], [4, 5], [2, 30], [3, 35], [4, 5], [2, 35], [3, 25], [4, 5], [2, 30], [3, 18]];
    for (const [stage, minutes] of plan) {
      for (let k = 0; k < minutes / 5; k++) {
        values.push(stage);
        labels.push(clock(23 * 60 + 30, values.length - 1, 5));
      }
    }
    return { values, labels, step: true, start: "23:30", end: "07:08", min: 0.5, max: 4.5, kind: "sleep-stages" };
  }
  if (id === "bb") {
    for (let i = 0; i < 80; i++) {
      let x: number;
      if (i <= 28) x = 34 + (88 - 34) * Math.pow(i / 28, 0.8);
      else x = 88 - (i - 28) * 0.62 - (i > 44 && i < 52 ? (i - 44) * 1.2 : i >= 52 ? 9.6 : 0);
      values.push(Math.max(5, x + 1.5 * (r() - 0.5)));
      labels.push(clock(0, i, 15));
    }
    return { values, labels, start: "00:00", end: "Now" };
  }
  for (let i = 0; i < 80; i++) {
    const night = i < 28;
    const base = night ? 14 : 30 + 8 * Math.sin(i / 5);
    const spike = !night && r() > 0.86 ? 22 * r() : 0;
    values.push(Math.max(2, base + 7 * (r() - 0.5) + spike));
    labels.push(clock(0, i, 15));
  }
  return { values, labels, start: "00:00", end: "Now" };
}

/** Banister-style fitness (42-day) and fatigue (7-day) model with a projected taper. */
function loadModel(): LoadDay[] {
  const r = rng(77);
  const pattern = [60, 85, 55, 75, 0, 110, 65];
  const days: LoadDay[] = [];
  let fitness = 44;
  let fatigue = 46;
  for (let i = 0; i < 98; i++) {
    let tss = pattern[i % 7] * (1 + (0.28 * Math.min(i, 83)) / 83) * (0.85 + 0.3 * r());
    if (i % 28 >= 21 && i < 77) tss *= 0.62;
    if (i >= 84 && i <= 90) tss *= 0.6;
    if (i >= 91 && i <= 96) tss *= 0.35;
    if (i === 97) tss = 115;
    const form = fitness - fatigue;
    fitness += (tss - fitness) / 42;
    fatigue += (tss - fatigue) / 7;
    days.push({ fitness, fatigue, form });
  }
  return days;
}

const METRICS: Omit<RecoveryMetric, "daily" | "intraday">[] = [
  {
    id: "hrv", name: "HRV", unit: "ms", value: "62", sub: "7-day avg · last night 58", status: "Balanced", tone: "good",
    band: [55, 68], bandLabel: "Your baseline 55–68 ms", spread: 6, format: "ms",
    read: "Compare the 7-day average with your own baseline band. A single low night is noise, and absolute numbers mean little between people.",
    rule: "Below the band for 3+ days: swap intensity for Zone 2 and protect sleep. Well above the band can also mean fatigue, not freshness.",
    evidence: "A 2021 meta-analysis found HRV-guided plans beat fixed plans only by a small margin; their real win is fewer athletes going backwards.",
  },
  {
    id: "rhr", name: "Resting HR", unit: "bpm", value: "49", sub: "Baseline 48 ± 3", status: "At baseline", tone: "good",
    band: [45, 51], bandLabel: "Your baseline 45–51 bpm", spread: 2.2, format: "bpm",
    read: "Your overnight resting heart rate against your baseline.",
    rule: "5+ bpm above baseline for 2 mornings with HRV down: easy day. Think illness, heat, alcohol or life stress first.",
    evidence: "Resting HR and HRV come from the same beat-to-beat signal and track each other closely, so treat it as confirmation, not a second vote.",
  },
  {
    id: "sleep", name: "Sleep", unit: "", value: "7h 38m", sub: "7-night avg 7h 21m · score 81", status: "Good", tone: "good",
    band: [7.5, 9], bandLabel: "Target 7.5–9 h", spread: 0.55, format: "hours",
    read: "Duration first, consistency second, the score third.",
    rule: "Aim for 8 hours, with bedtime within 30 minutes of usual. Two short nights before a key session: move the session.",
    evidence: "In young athletes, sleeping under 8 hours was linked to about 1.7× the injury rate. Sleep extension improved performance in college basketball players.",
  },
  {
    id: "bb", name: "Body Battery", unit: "", value: "88", sub: "Morning peak", status: "Charged", tone: "good",
    band: [60, 100], bandLabel: "Typical 60–100", spread: 11, format: "score",
    read: "Use the morning peak, not the live number during the day.",
    rule: "Context only. Never the reason to go hard.",
    evidence: "Body Battery is built from HRV, stress and sleep. In one analytics platform’s data it tracked overnight HRV and sleep score closely (median r ≈ 0.67–0.68), so it adds little on its own.",
  },
  {
    id: "stress", name: "Stress", unit: "", value: "24", sub: "Yesterday’s daytime avg", status: "Low", tone: "good",
    band: [0, 35], bandLabel: "Low 0–35", spread: 7, format: "score",
    read: "The weekly trend of daytime averages. Exercise raises it too.",
    rule: "Several high-stress days in a row: keep intensity modest and protect sleep.",
    evidence: "All-day stress scores barely matched how stressed people said they felt in a study of about 800 young adults. Overnight measures hold up better.",
  },
];

const DAILY_PARAMS: Record<MetricId, [number, number, number]> = {
  hrv: [61, 6, 62],
  rhr: [48.5, 2.2, 49],
  sleep: [7.35, 0.55, 7.63],
  bb: [78, 11, 88],
  stress: [28, 7, 24],
};

const SESSIONS: Session[] = [
  { id: "m1", week: "this", day: 0, discipline: "gym", title: "Lower-body strength", plan: 55, unit: "min", status: "done", actual: "55 min", rpe: 7, expectedRpe: 7, garminFeel: "Normal" },
  { id: "m2", week: "this", day: 0, discipline: "run", title: "Easy run", plan: 6, unit: "km", status: "done", intensity: "easy", actual: "6.0 km · 5:58 /km · 142 bpm", rpe: 3, expectedRpe: 3, garminFeel: "Normal" },
  { id: "t1", week: "this", day: 1, discipline: "swim", title: "Technique swim", plan: 2, unit: "km", status: "done", actual: "2.0 km · 2:05 /100 m", rpe: 4, expectedRpe: 4, garminFeel: "Normal" },
  { id: "w1", week: "this", day: 2, discipline: "run", title: "5 × 1 km at race pace", plan: 8, unit: "km", status: "done", intensity: "hard", actual: "8.0 km · reps 4:12 /km · 168 bpm", rpe: 8, expectedRpe: 6, garminFeel: "Weak", garminNote: "Legs heavy on reps 4–5" },
  { id: "th1", week: "this", day: 3, discipline: "gym", title: "HYROX stations", plan: 50, unit: "min", status: "done", actual: "50 min", rpe: 7, expectedRpe: 7, garminFeel: "Normal" },
  { id: "th2", week: "this", day: 3, discipline: "bike", title: "Zone 2 ride", plan: 70, unit: "min", status: "done", intensity: "easy", actual: "70 min · 31.4 km · 128 bpm", rpe: 3, expectedRpe: 3, garminFeel: "Strong" },
  { id: "s1", week: "this", day: 5, discipline: "run", title: "Easy run", plan: 8, unit: "km", status: "done", intensity: "easy", actual: "8.0 km · 6:02 /km · 145 bpm", rpe: 4, expectedRpe: 3, garminFeel: "Normal" },
  { id: "s2", week: "this", day: 5, discipline: "bike", title: "Zone 2 ride", plan: 70, unit: "min", status: "skipped", intensity: "easy", actual: "No activity recorded" },
  { id: "su1", week: "this", day: 6, discipline: "gym", title: "Half race-sim: stations", plan: 60, unit: "min", status: "today", intensity: "hard", actual: "Later today" },
  {
    id: "su2", week: "this", day: 6, discipline: "run", title: "Sim run legs: 4 × 1 km", plan: 5, unit: "km", status: "today", intensity: "hard", actual: "Later today",
    variants: {
      moved: { title: "Half race-sim · 4 × (1 km + station)", plan: 5 },
      movedLighter: { title: "Half race-sim · 3 × (1 km + station)", plan: 4 },
    },
  },
  {
    id: "n2", week: "next", day: 1, discipline: "run", title: "6 × 800 m at race pace", plan: 7, unit: "km", status: "planned", intensity: "hard",
    variants: {
      lighter: { title: "4 × 800 m at race pace", plan: 5.5 },
      easy: { title: "Easy run + 4 strides", plan: 5 },
      crossTrain: { title: "Bike intervals 6 × 2 min", plan: 45, unit: "min", discipline: "bike" },
    },
  },
  { id: "n3", week: "next", day: 2, discipline: "gym", title: "Stations, light", plan: 40, unit: "min", status: "planned" },
  { id: "n4", week: "next", day: 3, discipline: "bike", title: "Zone 2 ride", plan: 60, unit: "min", status: "planned", intensity: "easy" },
  { id: "n5", week: "next", day: 4, discipline: "swim", title: "Technique swim", plan: 1.5, unit: "km", status: "planned", variants: { test: { title: "Swim CSS test · 400 + 200 m", plan: 1.5 } } },
  { id: "n6", week: "next", day: 5, discipline: "run", title: "Easy run", plan: 6, unit: "km", status: "planned", intensity: "easy" },
  { id: "n7", week: "next", day: 6, discipline: "run", title: "Long easy run", plan: 8, unit: "km", status: "planned", intensity: "long", variants: { shorter: { title: "Long easy run", plan: 7 } } },
];

function markers(): ProgressMarker[] {
  const r = rng(99);
  const eff = Array.from({ length: 26 }, (_, i) => 385 - i * 0.92 + 5 * (r() - 0.5));
  eff[25] = 362;
  return [
    { id: "vo2", label: "VO₂ max", values: Array.from({ length: 26 }, (_, i) => (i < 9 ? 50 : i < 19 ? 51 : 52)), step: true, format: "vo2", value: "52", unit: "ml/kg/min", change: "+2 since May", note: "Trend only. Wrist estimates often sit 5–10% off a lab test, so watch the direction, not the number." },
    { id: "thr", label: "Threshold", values: Array.from({ length: 26 }, (_, i) => (i < 6 ? 292 : i < 13 ? 288 : i < 20 ? 283 : 278)), step: true, invert: true, format: "pace", value: "4:38", unit: "/km · 171 bpm", change: "−14 s since May", note: "From Garmin’s lactate-threshold detection. Retest every 6–8 weeks so your zones stay honest." },
    { id: "eff", label: "Easy pace", values: eff, invert: true, format: "pace-hr", value: "6:02", unit: "/km at 145 bpm", change: "−23 s since May", note: "Same heart rate, faster pace: the clearest sign your aerobic base is growing. Worked out from your easy runs." },
    { id: "css", label: "Swim CSS", empty: { title: "No CSS test yet", text: "Swim 400 m and then 200 m, both all-out with full rest between. Takes about 25 minutes and sets your swim zones.", schedulable: true } },
    { id: "ftp", label: "Bike FTP", empty: { title: "Needs a power meter", text: "Add a power meter or smart trainer to get FTP. Until then, bike zones come from heart rate." } },
  ];
}

export function getSampleDashboard(): DashboardData {
  return {
    today: "2026-11-15",
    todayLabel: "Sunday, 15 November 2026",
    block: { chip: "Peak week · taper starts tomorrow", race: "HYROX", daysToRace: 14, weekNote: "Taper starts tomorrow" },
    syncedAt: "07:12",
    garmin: { readiness: 84, readinessLabel: "Prime", suggestion: "25 min tempo run" },
    todayVariants: {
      go: { pill: "Go", title: "Half race-sim, as planned", session: "4 × (1 km at race pace + 1 station). Walk the Roxzone between efforts. This is your last hard session before the taper.", cap: "Running today: 5 km. That closes your 27 km week.", garminTag: "Capped", garminNote: "Garmin also suggests a 25-min tempo. Your build caps this week at 27 km, so the sim’s 5 km is all the running today." },
      easy: { pill: "Modified", title: "Stations hard, no run legs", session: "HYROX stations at race effort: sled push and pull, wall balls, lunges. Swap the 4 × 1 km for SkiErg or row. The run legs move to Tuesday.", cap: "Running today: 0 km. The week ends at 22 km, and that’s fine.", garminTag: "Overruled", garminNote: "Garmin’s readiness can’t tell how you feel. Your check-in wins." },
      stop: { pill: "Recover", title: "Recovery day", session: "30 min easy spin or a walk, then mobility. The race-sim moves to Tuesday and next week shifts around it.", cap: "Running today: 0 km", garminTag: "Overruled", garminNote: "A rough morning outweighs a good readiness score." },
    },
    initialCheckIn: 4,
    weekStarts: { this: "2026-11-09", next: "2026-11-16" },
    weekLabels: {
      this: { title: "This week", sub: "Mon 9 – Sun 15 Nov · peak week" },
      next: { title: "Next week", sub: "Mon 16 – Sun 22 Nov · taper week 1" },
    },
    sessions: SESSIONS,
    initialFeels: { m1: "expected", m2: "expected", t1: "expected", w1: "harder", th1: "expected", th2: "easy", s1: "expected" },
    initialSelectedSession: "w1",
    recovery: METRICS.map((m, i) => {
      const [mean, amp, last] = DAILY_PARAMS[m.id];
      return { ...m, daily: daily(i, mean, amp, last), intraday: intraday(m.id) };
    }),
    recoveryContext: { hrv7: 62, hrvBand: [55, 68], rhrNote: "RHR at baseline", sleepNote: "7h 38m sleep" },
    run: {
      historyStart: "2026-09-07",
      history: [
        { km: 19, longRun: 10, phase: "Build" },
        { km: 21, longRun: 11, phase: "Build" },
        { km: 22, longRun: 12, phase: "Build" },
        { km: 17, longRun: 9, phase: "Lighter week" },
        { km: 23, longRun: 12, phase: "Build" },
        { km: 24, longRun: 13, phase: "Build" },
        { km: 25, longRun: 13, phase: "Build" },
        { km: 26, longRun: 14, phase: "Build" },
        { km: 21, longRun: 10, phase: "Lighter week" },
      ],
      currentLongRun: 8,
      ahead: [
        { km: 16, phase: "Race week, incl. HYROX" },
        { km: 10, phase: "Recover" },
        { km: 15, phase: "Recover" },
        { km: 22, phase: "Rebuild" },
      ],
      rebuildFrom: 22,
      peak: 45,
      target: 40,
      targetLabel: "Half-marathon base · 40 km",
      singleRunCap: 15.4,
      tolerance: 30,
      impactLoad: 22.4,
      easyDriftPct: 3.1,
      longestThisWeek: 8,
      horizon: 15,
    },
    load: { days: loadModel(), startDate: "2026-08-24", todayIndex: 83, raceIndex: 97, raceLabel: "HYROX · Nov 29" },
    markers: markers(),
    markersStart: "2026-05-24",
    fuel: { weightKg: 75, eaten: { carbs: 212, protein: 88 } },
    week: { start: "2026-11-09", title: "This week", sub: "Mon 9 – Sun 15 Nov", todayIndex: 6, activities: [], targets: WEEKLY_TARGETS },
  };
}
