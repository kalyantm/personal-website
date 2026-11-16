export type Pt = [number, number];

/** Map a value to an SVG y coordinate (top = high). */
export function scaleY(v: number, height: number, lo: number, hi: number, padY: number): number {
  return height - padY - (height - 2 * padY) * ((v - lo) / (hi - lo || 1));
}

export function toPoints(values: number[], width: number, height: number, lo: number, hi: number, padX: number, padY: number): Pt[] {
  const n = values.length;
  return values.map((v, i) => [padX + (width - 2 * padX) * (n === 1 ? 0 : i / (n - 1)), scaleY(v, height, lo, hi, padY)]);
}

const f = (n: number) => n.toFixed(1);

/** Catmull-Rom spline through the points, as cubic Béziers. */
export function smoothPath(p: Pt[]): string {
  if (!p.length) return "";
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 0; i < p.length - 1; i++) {
    const p0 = p[i - 1] ?? p[i];
    const p1 = p[i];
    const p2 = p[i + 1];
    const p3 = p[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2[0])} ${f(p2[1])}`;
  }
  return d;
}

export function stepPath(p: Pt[]): string {
  if (!p.length) return "";
  let d = `M${f(p[0][0])} ${f(p[0][1])}`;
  for (let i = 1; i < p.length; i++) d += ` H${f(p[i][0])} V${f(p[i][1])}`;
  return d;
}

/** Close a line path down to a baseline to make a filled area. */
export function areaPath(line: string, p: Pt[], baseY: number): string {
  if (!p.length) return "";
  return `${line} L${f(p[p.length - 1][0])} ${baseY} L${f(p[0][0])} ${baseY} Z`;
}

export function rectPath(x: number, y: number, w: number, h: number): string {
  return `M${f(x)} ${f(y)}h${f(w)}v${f(h)}h${f(-w)}Z`;
}

/** Percentage position for a tooltip, clamped so it never leaves the chart. */
export function pctLeft(x: number, width: number, min = 10, max = 90): string {
  return `${Math.max(min, Math.min(max, (x / width) * 100)).toFixed(1)}%`;
}

export function extent(values: number[]): [number, number] {
  return [Math.min(...values), Math.max(...values)];
}
