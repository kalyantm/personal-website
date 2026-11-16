import { useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import { extent, pctLeft, scaleY, smoothPath, stepPath, type Pt } from "~/lib/fitness/chart";
import { addDays, formatMarker, parseISO, shortDate } from "~/lib/fitness/format";
import type { MarkerId, ProgressMarker } from "~/lib/fitness/types";
import { ProgressMarkersInfo } from "./section-info";
import { ChartTip, GlassCard, ScrubInput, Segmented, useScrub } from "./ui/primitives";

const W = 760;
const H = 180;
const PAD_Y = 22;

export function ProgressMarkers({
  markers,
  startDate,
  cssScheduled = false,
  onToggleCss,
}: {
  markers: ProgressMarker[];
  startDate: string;
  /** Phase 2: scheduling a CSS test from the empty state */
  cssScheduled?: boolean;
  onToggleCss?: () => void;
}) {
  const [id, setId] = useState<MarkerId>(markers[0].id);
  const marker = markers.find((m) => m.id === id) ?? markers[0];

  return (
    <GlassCard labelledBy="perf-h" delay={0.16} className="flex flex-col gap-4 rounded-[28px] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="perf-h" className="fx-card-h flex items-center gap-2">
            Progress markers
            <ProgressMarkersInfo />
          </h2>
          <span className="fx-text2 text-[13px]">From Garmin · weekly</span>
        </div>
        <Segmented label="Marker" value={id} onChange={setId} options={markers.map((m) => ({ value: m.id, label: m.label }))} />
      </div>

      {marker.values ? (
        <MarkerTrend key={marker.id} marker={marker} startDate={marker.startDate ?? startDate} />
      ) : (
        <div className="fx-inset flex max-w-[620px] flex-col gap-2.5 rounded-[18px] p-[18px]">
          <h3 className="m-0 text-base font-bold">{marker.empty?.schedulable && cssScheduled ? "CSS test scheduled" : marker.empty?.title}</h3>
          <p className="fx-note">{marker.empty?.text}</p>
          {marker.empty?.schedulable && onToggleCss && (
            <div className="flex flex-wrap items-center gap-3">
              <Button type="button" className="fx-btn fx-btn-sm" onClick={onToggleCss}>
                {cssScheduled ? "Remove from plan" : "Add to next Friday"}
              </Button>
              <span role="status" className="fx-good text-[13px]">
                {cssScheduled ? "In next week’s plan." : ""}
              </span>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}

function MarkerTrend({ marker, startDate }: { marker: ProgressMarker; startDate: string }) {
  const values = useMemo(() => marker.values ?? [], [marker.values]);
  const n = values.length;
  const refYear = parseISO(startDate).getFullYear();

  const { pts, line, area } = useMemo(() => {
    const [min, max] = extent(values);
    const pad = (max - min) * 0.25 || 1;
    const lo = min - pad;
    const hi = max + pad;
    // Paces: lower is better, so flip the scale and improvement still reads as "up"
    const y = (v: number) => scaleY(marker.invert ? lo + hi - v : v, H, lo, hi, PAD_Y);
    const p: Pt[] = values.map((v, i) => [8 + ((W - 16) * i) / (n - 1), y(v)]);
    const l = marker.step ? stepPath(p) : smoothPath(p);
    return { pts: p, line: l, area: `${l} L${W - 8} ${H - PAD_Y} L8 ${H - PAD_Y} Z` };
  }, [values, marker.invert, marker.step, n]);

  const scrub = useScrub(n, 8 / W);
  const i = scrub.index ?? n - 1;
  const week = `Week of ${shortDate(addDays(startDate, 7 * i), refYear)}`;
  const valueText = formatMarker(values[i], marker.format ?? "vo2");

  return (
    <div className="flex flex-wrap items-stretch gap-6">
      <div className="flex max-w-[360px] flex-[1_1_240px] flex-col justify-center gap-3">
        <span className="flex flex-wrap items-baseline gap-1.5">
          <span className="fx-num text-[40px] font-bold tracking-[-0.03em]">{marker.value}</span>
          <span className="fx-text2 text-sm">{marker.unit}</span>
        </span>
        <span className="fx-tag fx-tag-good self-start">{marker.change}</span>
        <p className="fx-note">{marker.note}</p>
      </div>
      <div className="fx-scrub min-w-0 flex-[3_1_520px] pt-11" {...scrub.surface}>
        {scrub.index !== null && (
          <ChartTip left={pctLeft(pts[i][0], W)}>
            <strong className="font-bold">{week}</strong>
            <br />
            <span className="fx-num">{valueText}</span>
          </ChartTip>
        )}
        <svg viewBox={`0 0 ${W} ${H}`} className="fx-c-swim block h-auto w-full" role="img" aria-label={`${marker.label} trend over the last six months: ${marker.change}`}>
          <path d={area} fill="currentColor" opacity="0.12" />
          <path d={line} fill="none" stroke="currentColor" strokeWidth="2.25" strokeLinecap="round" strokeLinejoin="round" />
          {scrub.index !== null && (
            <>
              <line x1={pts[i][0]} y1="6" x2={pts[i][0]} y2={H - PAD_Y} className="fx-hov" />
              <circle cx={pts[i][0]} cy={pts[i][1]} r="4.5" fill="currentColor" />
            </>
          )}
          <text x="8" y={H - 4} className="fx-ax">
            {shortDate(parseISO(startDate), refYear).split(" ")[1]}
          </text>
          <text x={W - 8} y={H - 4} textAnchor="end" className="fx-ax">
            Now
          </text>
        </svg>
        <ScrubInput count={n} value={i} onChange={scrub.onRangeChange} onBlur={scrub.clear} label="Scrub marker by week" valueText={`${week}: ${valueText}`} />
      </div>
    </div>
  );
}
