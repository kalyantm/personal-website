export type Discipline = "run" | "bike" | "swim" | "gym";
export type SessionStatus = "done" | "today" | "planned" | "skipped" | "moved";
export type Feel = "easy" | "expected" | "harder" | "tired" | "niggle";
export type WeekKey = "this" | "next";
export type Tone = "good" | "warn" | "bad" | "neutral";
export type CallTone = "go" | "easy" | "stop";
export type Unit = "km" | "min";

/** A coach-authored alternative the plan engine can swap in. */
export interface SessionVariant {
  title: string;
  plan: number;
  unit?: Unit;
  discipline?: Discipline;
}

export interface Session {
  id: string;
  week: WeekKey;
  /** 0 = Monday … 6 = Sunday */
  day: number;
  discipline: Discipline;
  title: string;
  plan: number;
  unit: Unit;
  status: SessionStatus;
  /** Tags the engine uses to find "the next hard session", "the long run", etc. */
  intensity?: "easy" | "hard" | "long" | "test";
  actual?: string;
  /** Garmin self-evaluation: perceived effort 1–10 */
  rpe?: number;
  /** Effort the plan expected, for the "felt harder than usual" check */
  expectedRpe?: number;
  /** Garmin self-evaluation: Very weak … Very strong */
  garminFeel?: string;
  /** Note typed on the watch or in Garmin Connect */
  garminNote?: string;
  variants?: {
    lighter?: SessionVariant;
    easy?: SessionVariant;
    crossTrain?: SessionVariant;
    shorter?: SessionVariant;
    test?: SessionVariant;
    /** What this session becomes when it moves to another day */
    moved?: SessionVariant;
    movedLighter?: SessionVariant;
  };
  /** Filled in by the plan engine */
  adjusted?: boolean;
  previousTitle?: string;
  reason?: string;
}

export interface TodayVariant {
  pill: string;
  title: string;
  session: string;
  cap: string;
  garminTag: string;
  garminNote: string;
}

export type MetricId = "hrv" | "rhr" | "sleep" | "bb" | "stress";
export type MetricFormat = "ms" | "bpm" | "hours" | "score";

export interface IntradaySeries {
  /** null = no reading in that slot (drawn as a gap) */
  values: (number | null)[];
  labels: string[];
  /** Draw as steps (sleep stages, VO₂ max updates) instead of a smooth curve */
  step?: boolean;
  start: string;
  end: string;
  min?: number;
  max?: number;
  kind?: "sleep-stages";
  /** What the 24-hour chart shows, e.g. "Heart rate" for the resting-HR tile */
  caption?: string;
}

export interface RecoveryMetric {
  id: MetricId;
  name: string;
  unit: string;
  value: string;
  sub: string;
  status: string;
  tone: Tone;
  band: [number, number];
  bandLabel: string;
  /** Typical day-to-day spread, used to pad chart scales */
  spread: number;
  format: MetricFormat;
  /** Last 90 days, oldest first, ending today */
  daily: number[];
  /**
   * "Today" view for metrics Garmin only reports as totals (sleep stages, stress levels):
   * time per category, plus where it sits in the last 24 hours when there's a window.
   */
  todayBreakdown?: TodayBreakdown;
  /** Since last night. Absent when the source has no intraday data (the "Today" range is hidden). */
  intraday?: IntradaySeries;
  read: string;
  rule: string;
  evidence: string;
}

export interface TodayBreakdown {
  caption: string;
  segments: { key: string; label: string; minutes: number; shade: number }[];
  /** Position of an event (e.g. the sleep window) inside the rolling 24 hours, as 0–1 fractions */
  window?: { from: number; to: number; fromLabel: string; toLabel: string; startLabel: string; endLabel: string };
  stats: { label: string; value: string }[];
  note?: string;
}

export interface LoadDay {
  fitness: number;
  fatigue: number;
  /** Morning form: yesterday's fitness minus yesterday's fatigue */
  form: number;
}

export type MarkerId = "vo2" | "thr" | "eff" | "css" | "ftp";
export type MarkerFormat = "vo2" | "pace" | "pace-hr";

export interface ProgressMarker {
  id: MarkerId;
  label: string;
  values?: number[];
  /** Monday of the first value's week, when it differs from DashboardData.markersStart */
  startDate?: string;
  step?: boolean;
  /** Lower is better (paces): plot inverted so improvement goes up */
  invert?: boolean;
  format?: MarkerFormat;
  value?: string;
  unit?: string;
  change?: string;
  note?: string;
  empty?: { title: string; text: string; schedulable?: boolean };
}

export interface DashboardData {
  /** ISO date of "today", e.g. 2026-11-15 */
  today: string;
  todayLabel: string;
  block: { chip: string; race: string; daysToRace: number; weekNote: string };
  syncedAt: string;
  garmin: { readiness: number; readinessLabel: string; suggestion: string };
  todayVariants: Record<CallTone, TodayVariant>;
  initialCheckIn: number;
  /** Monday of each week, ISO */
  weekStarts: Record<WeekKey, string>;
  weekLabels: Record<WeekKey, { title: string; sub: string }>;
  sessions: Session[];
  /** Feels already imported from Garmin self-evaluations */
  initialFeels: Record<string, Feel>;
  initialSelectedSession: string;
  recovery: RecoveryMetric[];
  recoveryContext: { hrv7: number; hrvBand: [number, number]; rhrNote: string; sleepNote: string };
  run: {
    /** Monday of the first history week, ISO */
    historyStart: string;
    history: { km: number; longRun: number; phase: string }[];
    currentLongRun: number;
    /** Fixed weeks after next week (race week, recovery, rebuild) */
    ahead: { km: number; phase: string }[];
    rebuildFrom: number;
    peak: number;
    target: number;
    targetLabel: string;
    singleRunCap: number;
    /** Longest run in the last 30 days, km */
    longest30?: number;
    tolerance: number;
    impactLoad: number;
    easyDriftPct: number;
    longestThisWeek: number;
    /** Projected weeks after the fixed ones */
    horizon: number;
  };
  load: {
    days: LoadDay[];
    startDate: string;
    todayIndex: number;
    /** Index of race day; beyond the last day when there is no projection */
    raceIndex: number;
    raceLabel: string;
    /** Garmin training load per day, aligned with `days` */
    dailyLoad?: number[];
    /** False when `days` ends today (phase 1: no projected taper) */
    projected?: boolean;
  };
  markers: ProgressMarker[];
  markersStart: string;
  fuel: {
    weightKg: number;
    /** Where the weight came from, e.g. "Garmin · 7 Nov" */
    weightSource?: string;
    eaten: { carbs: number; protein: number } | null;
    /** Minutes of training recorded today, used to preselect the day type */
    trainingMinutesToday?: number;
  };
  /** Phase 1: what actually happened this week, straight from Garmin activities. */
  week: WeekData;
  /** Latest wellness data on Garmin's side (the watch's last sync), local HH:MM */
  watchSyncedAt?: string;
  /** Where the Garmin-owned fields came from. Sample data is used until the key works. */
  source?: "garmin" | "sample";
  sourceError?: string;
  /** "stale" = Garmin couldn't be reached, so this is the last good sync */
  syncStatus?: { state: "fresh" | "stale"; reason?: string };
}

export type ActivityKind = Discipline | "other";

export interface WeekActivity {
  id: string;
  /** 0 = Monday … 6 = Sunday */
  day: number;
  kind: ActivityKind;
  title: string;
  /** Local start time, HH:MM */
  time: string;
  distanceKm: number | null;
  durationMin: number;
  avgHr: number | null;
  /** Running pace, seconds per km */
  paceSecPerKm: number | null;
  speedKmh: number | null;
}

export interface WeekTarget {
  amount: number;
  unit: "km" | "sessions";
}

export interface WeekData {
  /** Monday, ISO */
  start: string;
  title: string;
  sub: string;
  /** 0 = Monday … 6 = Sunday */
  todayIndex: number;
  activities: WeekActivity[];
  targets: Record<Discipline, WeekTarget>;
}
