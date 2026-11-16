/** The goal race. Change these when the next one is booked. */
export const RACE = { name: "HYROX", date: "2026-11-29" } as const;

/** Whole calendar days from `fromISO` to the race. 0 on race day, negative after. */
export function daysUntil(raceISO: string, fromISO: string): number {
  return Math.round((Date.parse(`${raceISO}T00:00:00Z`) - Date.parse(`${fromISO}T00:00:00Z`)) / 86_400_000);
}
