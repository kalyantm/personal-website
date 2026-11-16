import type { MarkerFormat, MetricFormat, Unit } from "./types";

export const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const SLEEP_STAGES = ["", "Deep", "Light", "REM", "Awake"];

/** Parse YYYY-MM-DD as a local date (no timezone drift). */
export function parseISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

export function addDays(iso: string, n: number): Date {
  const d = parseISO(iso);
  d.setDate(d.getDate() + n);
  return d;
}

/** "Tue 3 Nov" */
export function dayLabel(d: Date): string {
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

/** "25 Jan", with the year added when it differs from refYear */
export function shortDate(d: Date, refYear: number): string {
  return `${d.getDate()} ${MONTHS[d.getMonth()]}${d.getFullYear() !== refYear ? ` ${d.getFullYear()}` : ""}`;
}

/** "Tue 17" for a session's day in its week */
export function sessionDay(weekStart: string, day: number): string {
  const d = addDays(weekStart, day);
  return `${WEEKDAYS[d.getDay()]} ${d.getDate()}`;
}

export function signed(v: number): string {
  return `${v >= 0 ? "+" : "−"}${Math.abs(Math.round(v))}`;
}

export function signedFixed(v: number, digits = 1): string {
  return `${v >= 0 ? "+" : "−"}${Math.abs(v).toFixed(digits)}`;
}

export function hoursMinutes(h: number): string {
  const total = Math.round(h * 60);
  return `${Math.floor(total / 60)}h ${String(total % 60).padStart(2, "0")}m`;
}

export function minutesToHM(min: number): string {
  return `${Math.floor(min / 60)}h ${String(min % 60).padStart(2, "0")}m`;
}

export function mmss(sec: number): string {
  const s = Math.round(sec);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

export function formatMetric(v: number, f: MetricFormat): string {
  switch (f) {
    case "ms":
      return `${Math.round(v)} ms`;
    case "bpm":
      return `${Math.round(v)} bpm`;
    case "hours":
      return hoursMinutes(v);
    default:
      return String(Math.round(v));
  }
}

export function formatMarker(v: number, f: MarkerFormat): string {
  if (f === "vo2") return `${Math.round(v)} ml/kg/min`;
  if (f === "pace") return `${mmss(v)} /km`;
  return `${mmss(v)} /km`;
}

export function amount(v: number, unit: Unit): string {
  return unit === "km" ? `${v.toFixed(1)} km` : `${Math.round(v)} min`;
}

/** Plain-language reading of a form (TSB) value. */
export function formMeaning(form: number): string {
  if (form > 25) return "Very fresh. Fitness starts to fade if this lasts.";
  if (form >= 10) return "Race-ready: fresh, with fitness intact.";
  if (form >= -10) return "Balanced: normal training.";
  if (form >= -30) return "Building: productive fatigue from hard training.";
  return "Deep fatigue: time to back off.";
}
