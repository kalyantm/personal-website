import { useMemo, useState } from "react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogTitle } from "~/components/ui/dialog";
import { cn } from "~/lib/utils";
import { pctLeft } from "~/lib/fitness/chart";
import { bandStatus, rangeOptionsFor, sheetGeometry, sheetSeries, sparkline, type RangeKey } from "~/lib/fitness/recovery";
import { minutesToHM } from "~/lib/fitness/format";
import type { MetricId, RecoveryMetric, TodayBreakdown } from "~/lib/fitness/types";
import { RecoveryInfo } from "./section-info";
import { ChartTip, Rise, ScrubInput, Segmented, useScrub } from "./ui/primitives";

export function Recovery({ metrics, todayISO, themeClass }: { metrics: RecoveryMetric[]; todayISO: string; themeClass: string }) {
  const [open, setOpen] = useState(false);
  // Kept after closing so the dialog can animate out with its content intact
  const [shownId, setShownId] = useState<MetricId>(metrics[0].id);
  const [range, setRange] = useState<RangeKey>("30");
  const metric = metrics.find((m) => m.id === shownId) ?? metrics[0];

  return (
    <Rise labelledBy="rec-h" delay={0.22} className="flex flex-col gap-3">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="rec-h" className="fx-sec-h flex items-center gap-2">
          Recovery
          <RecoveryInfo />
        </h2>
        <p className="fx-note">These five share inputs and move together, so read them as one signal. Tap a tile for detail.</p>
      </div>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(190px,1fr))] gap-3">
        {metrics.map((m) => (
          <RecoveryTile
            key={m.id}
            metric={m}
            onOpen={() => {
              setShownId(m.id);
              const opts = rangeOptionsFor(m);
              setRange(opts.some((o) => o.value === "30") ? "30" : opts[opts.length - 1].value);
              setOpen(true);
            }}
          />
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          showCloseButton={false}
          className={cn("fx", themeClass, "max-w-[calc(100%-2rem)] gap-0 rounded-[32px] border-0 bg-transparent p-0 shadow-none sm:max-w-[760px]")}
        >
          <div className="fx-glass fx-glass-strong flex max-h-[calc(100dvh-40px)] flex-col gap-[18px] overflow-y-auto overscroll-contain rounded-[32px] p-[clamp(20px,3vw,30px)]">
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <p className={cn("fx-label", `fx-c-${metric.id}`)}>{metric.name}</p>
                <DialogTitle asChild>
                  <h2 className="m-0 flex flex-wrap items-baseline gap-2 font-normal leading-none">
                    <span className="fx-num text-[44px] font-bold tracking-[-0.03em]">{metric.value}</span>
                    {metric.unit && <span className="fx-text2 text-base font-medium">{metric.unit}</span>}
                    <span className={cn("fx-tag", `fx-tag-${metric.tone}`)}>{metric.status}</span>
                  </h2>
                </DialogTitle>
                <DialogDescription className="fx-note">{metric.sub}</DialogDescription>
              </div>
              <DialogClose asChild>
                <button type="button" className="fx-iconbtn" aria-label="Close">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
                    <path d="M6 6l12 12M18 6L6 18" />
                  </svg>
                </button>
              </DialogClose>
            </div>

            <Segmented label="Time range" value={range} onChange={setRange} options={rangeOptionsFor(metric)} className="self-start" />

            {range === "today" && !metric.intraday && metric.todayBreakdown ? (
              <BreakdownBody key={`${metric.id}-today`} metric={metric} breakdown={metric.todayBreakdown} />
            ) : (
              <SheetBody key={`${metric.id}-${range}`} metric={metric} range={range} todayISO={todayISO} />
            )}

            <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
              <TextBlock label="How to read it">{metric.read}</TextBlock>
              <TextBlock label="Your rule">{metric.rule}</TextBlock>
              <TextBlock label="Evidence" muted>
                {metric.evidence}
              </TextBlock>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Rise>
  );
}

function RecoveryTile({ metric, onOpen }: { metric: RecoveryMetric; onOpen: () => void }) {
  const s = useMemo(() => sparkline(metric), [metric]);
  return (
    <button
      type="button"
      onClick={onOpen}
      aria-haspopup="dialog"
      aria-label={`${metric.name} ${metric.value} ${metric.unit}, ${metric.status}. Open detail`}
      className="fx-glass fx-press flex w-full flex-col gap-2 rounded-3xl p-[18px] text-left"
    >
      <span className="flex w-full items-center justify-between gap-2">
        <span className={cn("text-[13px] font-semibold", `fx-c-${metric.id}`)}>{metric.name}</span>
        <span className={cn("fx-tag", `fx-tag-${metric.tone}`)}>{metric.status}</span>
      </span>
      <span className="flex items-baseline gap-1">
        <span className="fx-num text-[32px] font-bold tracking-[-0.025em]">{metric.value}</span>
        <span className="fx-text2 text-sm">{metric.unit}</span>
      </span>
      <span className="fx-text2 text-xs">{metric.sub}</span>
      <svg viewBox="0 0 200 48" className={cn("block h-auto w-full", `fx-c-${metric.id}`)} aria-hidden="true">
        <rect x="0" y={s.bandY} width="200" height={s.bandH} rx="4" fill="currentColor" opacity="0.10" />
        <path d={s.area} fill="currentColor" opacity="0.14" />
        <path d={s.line} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={s.lastX} cy={s.lastY} r="3.2" fill="currentColor" />
      </svg>
    </button>
  );
}

function SheetBody({ metric, range, todayISO }: { metric: RecoveryMetric; range: RangeKey; todayISO: string }) {
  const series = useMemo(() => sheetSeries(metric, range, todayISO), [metric, range, todayISO]);
  const geo = useMemo(() => sheetGeometry(series), [series]);
  const n = series.values.length;
  const scrub = useScrub(n, 10 / 680);
  const i = scrub.index ?? geo.lastIdx;
  const v = series.values[i];
  const x = geo.xAt(i);
  const pt = geo.pts[i];
  const status = bandStatus(v, series.band);
  const text = `${series.labels[i]}: ${series.format(v)}${status ? `, ${status}` : ""}`;

  return (
    <>
      <div className="flex flex-col gap-1.5">
        <div className="fx-scrub pt-12" style={{ touchAction: "none" }} {...scrub.surface}>
          {scrub.index !== null && (
            <ChartTip left={pctLeft(x, 680)}>
              <strong className="font-bold">{series.labels[i]}</strong>
              <br />
              <span className="fx-num">{series.format(v)}</span>
              {status && <span className="fx-text2"> · {status}</span>}
            </ChartTip>
          )}
          <svg viewBox="0 0 680 220" className={cn("block h-auto w-full", `fx-c-${metric.id}`)} role="img" aria-label={`${series.caption}. Use the slider to read values.`}>
            {geo.band && <rect x="0" y={geo.band.y} width="680" height={geo.band.h} rx="8" fill="currentColor" opacity="0.10" />}
            <text x="672" y={geo.band ? geo.band.y + 15 : 16} textAnchor="end" className="fx-ax">
              {series.bandLabel}
            </text>
            {geo.area && <path d={geo.area} fill="currentColor" opacity="0.12" />}
            <path d={geo.line} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            {scrub.index !== null && <line x1={x} y1="4" x2={x} y2="216" className="fx-hov" />}
            {pt && (
              <>
                <circle cx={pt[0]} cy={pt[1]} r="11" fill="currentColor" opacity="0.2" />
                <circle cx={pt[0]} cy={pt[1]} r="5" fill="currentColor" />
              </>
            )}
          </svg>
          <ScrubInput count={n} value={i} onChange={scrub.onRangeChange} onBlur={scrub.clear} label="Scrub through the chart" valueText={text} />
        </div>
        <div className="fx-text3 flex justify-between text-xs">
          <span>{series.start}</span>
          <span>{series.end}</span>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {series.stats.map((s) => (
          <div key={s.label} className="fx-inset flex flex-col gap-0.5 rounded-2xl px-3.5 py-3">
            <span className="fx-text2 text-xs">{s.label}</span>
            <span className="fx-num text-lg font-bold">{s.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function BreakdownBody({ metric, breakdown: b }: { metric: RecoveryMetric; breakdown: TodayBreakdown }) {
  const total = b.segments.reduce((t, s) => t + s.minutes, 0) || 1;
  const shown = b.segments.filter((s) => s.minutes > 0);
  const summary = shown.map((s) => `${s.label} ${minutesToHM(s.minutes)}`).join(", ");
  return (
    <>
      <div className={cn("flex flex-col gap-3", `fx-c-${metric.id}`)}>
        <p className="fx-label m-0">{b.caption}</p>
        {b.window && (
          <div className="flex flex-col gap-1.5">
            <div
              className="fx-bd-track relative h-9 rounded-xl"
              role="img"
              aria-label={`Asleep from ${b.window.fromLabel} to ${b.window.toLabel}, within the last 24 hours`}
            >
              <div
                className="absolute inset-y-0 rounded-xl"
                style={{ left: `${b.window.from * 100}%`, width: `${Math.max(1, (b.window.to - b.window.from) * 100)}%`, background: "currentColor", opacity: 0.55 }}
              />
              <span
                className="fx-bd-tag absolute top-1/2 -translate-y-1/2"
                style={b.window.from > 0.55 ? { right: `calc(${(1 - b.window.to) * 100}% + 8px)` } : { left: `calc(${b.window.from * 100}% + 8px)` }}
              >
                {b.window.fromLabel}–{b.window.toLabel}
              </span>
            </div>
            <div className="fx-text3 flex justify-between text-xs">
              <span>{b.window.startLabel}</span>
              <span>{b.window.endLabel}</span>
            </div>
          </div>
        )}
        <div className="fx-bd-track flex h-4 overflow-hidden rounded-full" role="img" aria-label={summary}>
          {shown.map((s) => (
            <div key={s.key} style={{ width: `${(s.minutes / total) * 100}%`, background: "currentColor", opacity: s.shade }} />
          ))}
        </div>
        <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-[13px]">
          {b.segments.map((s) => (
            <span key={s.key} className="inline-flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: "currentColor", opacity: Math.max(s.shade, 0.18) }} aria-hidden="true" />
              <span className="text-[color:var(--fx-text)]">{s.label}</span>
              <span className="fx-num fx-text2">{minutesToHM(s.minutes)}</span>
            </span>
          ))}
        </div>
        {b.note && <p className="fx-note m-0">{b.note}</p>}
      </div>
      <div className="grid grid-cols-3 gap-2.5">
        {b.stats.map((s) => (
          <div key={s.label} className="fx-inset flex flex-col gap-0.5 rounded-2xl px-3.5 py-3">
            <span className="fx-text2 text-xs">{s.label}</span>
            <span className="fx-num text-lg font-bold">{s.value}</span>
          </div>
        ))}
      </div>
    </>
  );
}

function TextBlock({ label, children, muted }: { label: string; children: string; muted?: boolean }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="fx-label">{label}</p>
      <p className={cn("m-0 text-sm leading-normal", muted && "fx-text2")}>{children}</p>
    </div>
  );
}
