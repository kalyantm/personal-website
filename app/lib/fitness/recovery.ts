import { areaPath, scaleY, smoothPath, stepPath, toPoints } from "./chart";
import { addDays, dayLabel, formatMetric, minutesToHM, SLEEP_STAGES } from "./format";
import type { RecoveryMetric } from "./types";

export type RangeKey = "today" | "7" | "14" | "30" | "60" | "90";

export const RANGE_OPTIONS: { value: RangeKey; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "7", label: "7D" },
  { value: "14", label: "14D" },
  { value: "30", label: "30D" },
  { value: "60", label: "60D" },
  { value: "90", label: "90D" },
];

export interface SheetSeries {
  /** null = no reading (a gap in the line) */
  values: (number | null)[];
  labels: string[];
  step: boolean;
  lo: number;
  hi: number;
  band: [number, number] | null;
  bandLabel: string;
  start: string;
  end: string;
  stats: { label: string; value: string }[];
  format: (v: number | null) => string;
  caption: string;
}

/** Ranges worth offering: "Today" only with intraday or breakdown data; past the available history, one "All" option. */
export function rangeOptionsFor(metric: RecoveryMetric): { value: RangeKey; label: string }[] {
  const days = metric.daily.length;
  const out: { value: RangeKey; label: string }[] = [];
  for (const o of RANGE_OPTIONS) {
    if (o.value === "today") {
      if (metric.intraday || metric.todayBreakdown) out.push(o);
      continue;
    }
    const n = Number(o.value);
    if (n <= days) out.push(o);
    else {
      // Less history than this range: offer it once, labelled as everything there is.
      out.push({ value: o.value, label: `All ${days}D` });
      break;
    }
  }
  return out;
}

/** Everything the detail chart needs for one metric and one range. */
export function sheetSeries(metric: RecoveryMetric, range: RangeKey, todayISO: string): SheetSeries {
  if (range === "today" && metric.intraday) {
    const t = metric.intraday;
    const isSleep = t.kind === "sleep-stages";
    const fmtNum = isSleep ? (v: number) => SLEEP_STAGES[Math.round(v)] : (v: number) => formatMetric(v, metric.format === "hours" ? "score" : metric.format);
    const format = (v: number | null) => (v === null ? "No reading" : fmtNum(v));
    const real = t.values.filter((v): v is number => v !== null);
    const lo = t.min ?? Math.min(...real) - 3;
    const hi = t.max ?? Math.max(...real) + 3;
    let stats: SheetSeries["stats"];
    if (isSleep) {
      const minutes = (stage: number) => t.values.filter((v) => v === stage).length * 5;
      stats = [
        { label: "Deep", value: minutesToHM(minutes(1)) },
        { label: "REM", value: minutesToHM(minutes(3)) },
        { label: "Light", value: minutesToHM(minutes(2)) },
      ];
    } else if (metric.id === "bb") {
      stats = [
        { label: "Highest", value: fmtNum(Math.max(...real)) },
        { label: "Now", value: fmtNum(real[real.length - 1]) },
        { label: "Lowest", value: fmtNum(Math.min(...real)) },
      ];
    } else {
      stats = basicStats(real, fmtNum, metric.id === "hrv" ? "Overnight avg" : "Average");
    }
    return {
      values: t.values,
      labels: t.labels,
      step: !!t.step,
      lo,
      hi,
      band: null,
      bandLabel: isSleep ? "Deep at the bottom · Awake at the top" : t.caption ?? "Last 24 hours",
      start: t.start,
      end: t.end,
      stats,
      format,
      caption: `${t.caption ?? metric.name} over the last 24 hours`,
    };
  }

  // A new watch has less history than the range asks for: show what exists.
  const values = metric.daily.slice(-(range === "today" ? 7 : Number(range)));
  const n = values.length;
  const format = (v: number | null) => (v === null ? "No reading" : formatMetric(v, metric.format));
  const labels = values.map((_, i) => dayLabel(addDays(todayISO, -(n - 1 - i))));
  return {
    values,
    labels,
    step: false,
    lo: Math.min(...values, metric.band[0]) - metric.spread * 0.4,
    hi: Math.max(...values, metric.band[1]) + metric.spread * 0.4,
    band: metric.band,
    bandLabel: metric.bandLabel,
    start: labels[0],
    end: "Today",
    stats: basicStats(values, format, "Average"),
    format,
    caption: `${metric.name} over the last ${n} days`,
  };
}

function basicStats(values: number[], format: (v: number) => string, avgLabel: string) {
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  return [
    { label: avgLabel, value: format(avg) },
    { label: "Lowest", value: format(Math.min(...values)) },
    { label: "Highest", value: format(Math.max(...values)) },
  ];
}

export function bandStatus(v: number | null, band: [number, number] | null): string {
  if (!band || v === null) return "";
  if (v > band[1]) return "above your band";
  if (v < band[0]) return "below your band";
  return "in your band";
}

/** Geometry for a tile's 14-day sparkline (viewBox 200 × 48). */
export function sparkline(metric: RecoveryMetric) {
  const d = metric.daily.slice(-14);
  const lo = Math.min(...d, metric.band[0]) - metric.spread * 0.3;
  const hi = Math.max(...d, metric.band[1]) + metric.spread * 0.3;
  const pts = toPoints(d, 200, 48, lo, hi, 4, 6);
  const line = smoothPath(pts);
  const top = scaleY(metric.band[1], 48, lo, hi, 6);
  const bottom = scaleY(metric.band[0], 48, lo, hi, 6);
  const last = pts[pts.length - 1];
  return { line, area: areaPath(line, pts, 48), bandY: top, bandH: Math.max(2, bottom - top), lastX: last[0], lastY: last[1] };
}

/** Geometry for the detail chart (viewBox 680 × 220). Gaps (null) split the line into segments. */
export function sheetGeometry(s: SheetSeries) {
  const n = s.values.length;
  const xAt = (i: number) => 10 + (680 - 20) * (n === 1 ? 0 : i / (n - 1));
  const pts: ([number, number] | null)[] = s.values.map((v, i) => (v === null ? null : [xAt(i), scaleY(v, 220, s.lo, s.hi, 18)]));
  const segments: [number, number][][] = [];
  let cur: [number, number][] = [];
  for (const p of pts) {
    if (p) cur.push(p);
    else if (cur.length) {
      segments.push(cur);
      cur = [];
    }
  }
  if (cur.length) segments.push(cur);
  let line = "";
  let area = "";
  for (const seg of segments) {
    if (seg.length === 1) {
      // A lone reading: draw a short tick so it stays visible
      line += ` M${(seg[0][0] - 1.5).toFixed(1)} ${seg[0][1].toFixed(1)} H${(seg[0][0] + 1.5).toFixed(1)}`;
      continue;
    }
    const l = s.step ? stepPath(seg) : smoothPath(seg);
    line += ` ${l}`;
    if (!s.step) area += ` ${areaPath(l, seg, 220)}`;
  }
  const band = s.band
    ? { y: scaleY(s.band[1], 220, s.lo, s.hi, 18), h: Math.max(2, scaleY(s.band[0], 220, s.lo, s.hi, 18) - scaleY(s.band[1], 220, s.lo, s.hi, 18)) }
    : null;
  let lastIdx = n - 1;
  while (lastIdx > 0 && pts[lastIdx] === null) lastIdx--;
  return { xAt, pts, line: line.trim(), area: area.trim(), band, lastIdx };
}
