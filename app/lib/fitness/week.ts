import type { Discipline, Feel, Session, Unit } from "./types";

export const DISCIPLINES: { id: Discipline; name: string; unit: Unit }[] = [
  { id: "run", name: "Run", unit: "km" },
  { id: "bike", name: "Bike", unit: "min" },
  { id: "swim", name: "Swim", unit: "km" },
  { id: "gym", name: "Strength", unit: "min" },
];

export interface ProgressSegment {
  id: string;
  /** Share of the planned total, 0–100 */
  width: number;
  state: "done" | "todo" | "miss";
}

export interface DisciplineProgress {
  discipline: Discipline;
  name: string;
  unit: Unit;
  done: number;
  total: number;
  pct: number | null;
  segments: ProgressSegment[];
  sessionsDone: number;
  sessionsTotal: number;
  avgEffort: number | null;
  flagged: number;
}

const flaggedFeel = (f?: Feel) => f === "harder" || f === "tired" || f === "niggle";

export function disciplineProgress(sessions: Session[], feels: Record<string, Feel>): DisciplineProgress[] {
  return DISCIPLINES.map(({ id, name, unit }) => {
    const xs = sessions.filter((s) => s.discipline === id);
    const total = xs.reduce((a, s) => a + s.plan, 0);
    const doneXs = xs.filter((s) => s.status === "done");
    const done = doneXs.reduce((a, s) => a + s.plan, 0);
    const rated = doneXs.filter((s) => s.rpe);
    return {
      discipline: id,
      name,
      unit,
      done,
      total,
      pct: total ? Math.round((done / total) * 100) : null,
      segments: xs.map((s) => ({
        id: s.id,
        width: total ? (s.plan / total) * 100 : 0,
        state: s.status === "done" ? "done" : s.status === "skipped" || s.status === "moved" ? "miss" : "todo",
      })),
      sessionsDone: doneXs.length,
      sessionsTotal: xs.length,
      avgEffort: rated.length ? rated.reduce((a, s) => a + (s.rpe ?? 0), 0) / rated.length : null,
      flagged: xs.filter((s) => flaggedFeel(feels[s.id])).length,
    };
  });
}

/** Planned and completed running for a set of sessions (moved and skipped runs don't count as planned). */
export function runTotals(sessions: Session[]): { plan: number; done: number } {
  const runs = sessions.filter((s) => s.discipline === "run");
  return {
    plan: runs.filter((s) => s.status !== "moved" && s.status !== "skipped").reduce((a, s) => a + s.plan, 0),
    done: runs.filter((s) => s.status === "done").reduce((a, s) => a + s.plan, 0),
  };
}
