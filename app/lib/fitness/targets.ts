import type { Discipline, WeekTarget } from "./types";

/** Weekly volume targets for phase 1. Swim is 0 until swimming starts. */
export const WEEKLY_TARGETS: Record<Discipline, WeekTarget> = {
  run: { amount: 15, unit: "km" },
  bike: { amount: 60, unit: "km" },
  swim: { amount: 0, unit: "km" },
  gym: { amount: 2, unit: "sessions" },
};

/**
 * "Easy pace" is your running pace while heart rate sits at the top of zone 2.
 * Garmin's default zones (from max HR) put zone 3 at 138 bpm, which is too low for you,
 * so the band is set by hand.
 */
export const EASY_HR = { low: 150, high: 158 } as const;

/** Where the Run build ramps toward, and the longest-run guardrail. */
export const RUN_BUILD = { target: 40, targetLabel: "Half-marathon base · 40 km", peak: 45, horizon: 12, singleRunJump: 0.1 } as const;
