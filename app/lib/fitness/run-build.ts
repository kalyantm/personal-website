export type RampStyle = "gentle" | "steady" | "daniels";

export const RAMP_OPTIONS: { value: RampStyle; label: string }[] = [
  { value: "gentle", label: "Gentle +5%" },
  { value: "steady", label: "Steady +8%" },
  { value: "daniels", label: "Step and hold" },
];

export const RAMP_NAMES: Record<RampStyle, string> = {
  gentle: "Gentle",
  steady: "Steady",
  daniels: "Step and hold",
};

export interface RunWeek {
  km: number;
  done?: number;
  longRun?: number;
  phase: string;
  kind: "actual" | "current" | "plan";
  hold?: boolean;
}

export interface ProjectionInput {
  history: { km: number; longRun: number; phase: string }[];
  current: { plan: number; done: number; longRun: number };
  /** A fixed next week; omit to start the projected ramp right after this week */
  next?: { km: number; phase: string };
  ahead: { km: number; phase: string }[];
  rebuildFrom: number;
  peak: number;
  style: RampStyle;
  hold: boolean;
  horizon: number;
}

/**
 * Weekly running volume: completed weeks, this week, the fixed weeks ahead,
 * then a projected ramp.
 * - Gentle / Steady: +5% / +8% a week.
 * - Step and hold (Daniels): +1.6 km per run (4 runs ≈ +6.4 km), held three weeks.
 * - Every fourth week is about 20% lighter.
 * - A hold adds one flat week before the ramp starts.
 */
export function projectRunBuild(input: ProjectionInput): RunWeek[] {
  const weeks: RunWeek[] = input.history.map((h) => ({ km: h.km, longRun: h.longRun, phase: h.phase, kind: "actual" }));
  weeks.push({ km: input.current.plan, done: input.current.done, longRun: input.current.longRun, phase: "This week", kind: "current" });
  if (input.next) weeks.push({ km: input.next.km, phase: input.next.phase, kind: "plan" });
  for (const a of input.ahead) weeks.push({ km: a.km, phase: a.phase, kind: "plan" });

  const rate = input.style === "gentle" ? 0.05 : input.style === "steady" ? 0.08 : 0;
  let level = input.rebuildFrom;
  let cycle = 0;
  for (let j = 0; j < input.horizon; j++) {
    if (input.hold && j === 0) {
      weeks.push({ km: level, phase: "Hold: a run felt hard", kind: "plan", hold: true });
      continue;
    }
    cycle++;
    if (cycle % 4 === 0) {
      weeks.push({ km: round1(level * 0.8), phase: "Lighter week", kind: "plan" });
      continue;
    }
    if (input.style === "daniels") {
      if (cycle % 4 === 1) level += 6.4;
    } else {
      level *= 1 + rate;
    }
    const capped = level >= input.peak;
    level = Math.min(level, input.peak);
    weeks.push({
      km: round1(level),
      phase: capped ? "Peak volume" : input.style === "daniels" ? "Step, then hold" : "Build",
      kind: "plan",
    });
  }
  return weeks;
}

const NOT_FULL = /Lighter|Recover|Race|Taper/;

/** % change against the most recent full (non-lighter, non-taper) week. */
export function changeVsLastFullWeek(weeks: RunWeek[], i: number): number | null {
  if (NOT_FULL.test(weeks[i].phase)) return null;
  for (let j = i - 1; j >= 0; j--) {
    if (!NOT_FULL.test(weeks[j].phase)) return Math.round((weeks[i].km / weeks[j].km - 1) * 100);
  }
  return null;
}

export function firstIndexAtOrAbove(weeks: RunWeek[], target: number, fromIndex: number): number {
  return weeks.findIndex((w, i) => i > fromIndex && w.km >= target);
}

export interface Gate {
  label: string;
  detail: string;
  status: "pass" | "hold" | "pending";
}

/** Phase 1 gates: only checks that real Garmin data can answer. */
export function runGates(a: { planned: number; done: number; hrv7: number; hrvBand: [number, number]; longest: number; cap: number }): Gate[] {
  const pct = a.planned ? a.done / a.planned : 1;
  const hrvOk = a.hrv7 >= a.hrvBand[0] && a.hrv7 <= a.hrvBand[1];
  return [
    { label: "Week nearly done", detail: `${a.done.toFixed(1)} of ${a.planned} km · ${Math.round(pct * 100)}%`, status: pct >= 0.9 ? "pass" : "pending" },
    { label: "HRV in your band", detail: `7-day avg ${a.hrv7} ms · band ${a.hrvBand[0]}–${a.hrvBand[1]}`, status: hrvOk ? "pass" : "hold" },
    { label: "Long run under the cap", detail: `Longest this week ${a.longest.toFixed(1)} km of ${a.cap} km`, status: a.longest <= a.cap ? "pass" : "hold" },
  ];
}

function round1(v: number): number {
  return Math.round(v * 10) / 10;
}
