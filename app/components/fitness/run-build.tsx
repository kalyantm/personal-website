import { useMemo, useState, type ReactNode } from "react";
import { cn } from "~/lib/utils";
import { pctLeft, rectPath } from "~/lib/fitness/chart";
import { addDays, MONTHS, parseISO, shortDate, signed } from "~/lib/fitness/format";
import {
  changeVsLastFullWeek,
  firstIndexAtOrAbove,
  projectRunBuild,
  RAMP_NAMES,
  RAMP_OPTIONS,
  runGates,
  type RampStyle,
} from "~/lib/fitness/run-build";
import type { DashboardData } from "~/lib/fitness/types";
import { ChartTip, GlassCard, ScrubInput, Segmented, StatTile, useScrub } from "./ui/primitives";

const W = 760;
const BASE = 196;
const MAX_KM = 48;

export function RunBuild({
  run,
  thisWeek,
  hrv7,
  hrvBand,
  info,
}: {
  run: DashboardData["run"];
  thisWeek: { plan: number; done: number };
  hrv7: number;
  hrvBand: [number, number];
  info?: ReactNode;
}) {
  const hold = false;
  const [style, setStyle] = useState<RampStyle>("steady");

  const weeks = useMemo(
    () =>
      projectRunBuild({
        history: run.history,
        current: { plan: thisWeek.plan, done: thisWeek.done, longRun: run.currentLongRun },
        ahead: run.ahead,
        rebuildFrom: run.rebuildFrom,
        peak: run.peak,
        style,
        hold,
        horizon: run.horizon,
      }),
    [run, thisWeek.plan, thisWeek.done, style, hold],
  );

  const n = weeks.length;
  const currentIdx = run.history.length;
  const slot = (W - 16) / n;
  const barW = slot * 0.6;
  const bx = (i: number) => 8 + slot * i + (slot - barW) / 2;
  const by = (km: number) => BASE - (km / MAX_KM) * 180;
  const refYear = parseISO(run.historyStart).getFullYear();
  const weekDate = (i: number) => addDays(run.historyStart, 7 * i);

  const paths = useMemo(() => {
    let act = "";
    let todo = "";
    let plan = "";
    let holdP = "";
    weeks.forEach((w, i) => {
      const x = bx(i);
      if (w.kind === "actual") act += rectPath(x, by(w.km), barW, BASE - by(w.km));
      else if (w.kind === "current") {
        const done = w.done ?? 0;
        act += rectPath(x, by(done), barW, BASE - by(done));
        if (w.km > done) todo += rectPath(x, by(w.km), barW, by(done) - by(w.km));
      } else if (w.hold) holdP += rectPath(x, by(w.km), barW, BASE - by(w.km));
      else plan += rectPath(x, by(w.km), barW, BASE - by(w.km));
    });
    return { act, todo, plan, hold: holdP };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weeks, n]);

  const monthTicks = useMemo(() => {
    const ticks: { x: number; label: string }[] = [];
    for (let i = 0; i < n; i++) {
      const d = weekDate(i);
      if (i === 0 || d.getMonth() !== weekDate(i - 1).getMonth()) ticks.push({ x: bx(i) + barW / 2, label: MONTHS[d.getMonth()] });
    }
    return ticks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n, run.historyStart]);

  const reach = firstIndexAtOrAbove(weeks, run.target, currentIdx);
  const reachLabel = reach > 0 ? shortDate(weekDate(reach), refYear) : null;
  const decision =
    (hold ? `Next increase on hold: one extra week at ${run.rebuildFrom} km before the ramp. ` : `Building from your ${run.rebuildFrom} km week: `) +
    (reachLabel ? `at ${RAMP_NAMES[style]} you reach ${run.target} km a week in the week of ${reachLabel}.` : `at ${RAMP_NAMES[style]} you stay under ${run.target} km a week in this window.`);

  const gates = runGates({ planned: thisWeek.plan, done: thisWeek.done, hrv7, hrvBand, longest: run.longestThisWeek, cap: run.singleRunCap });
  const nextWeekKm = weeks[currentIdx + 1]?.km ?? 0;

  const scrub = useScrub(n, 8 / W, "bins");
  const hi = scrub.index;
  const tip = hi === null ? null : describeWeek(hi);

  function describeWeek(i: number) {
    const w = weeks[i];
    const ch = changeVsLastFullWeek(weeks, i);
    const line1 =
      w.kind === "actual"
        ? `${w.km.toFixed(1)} km run${w.longRun ? ` · long run ${w.longRun} km` : ""}`
        : w.kind === "current"
          ? `${(w.done ?? 0).toFixed(1)} of ${w.km.toFixed(1)} km done`
          : `${w.km.toFixed(1)} km projected`;
    const line2 = ch === null ? "" : `${signed(ch)}% vs last full week`;
    const title = `Week of ${shortDate(weekDate(i), refYear)} · ${w.phase}`;
    return { title, line1, line2, text: [title, line1, line2].filter(Boolean).join(", ") };
  }

  return (
    <GlassCard labelledBy="build-h" delay={0.28} className="flex min-w-0 flex-col gap-4 rounded-[28px] p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="build-h" className="fx-card-h flex items-center gap-2">
            Run build
            {info}
          </h2>
          <span className="fx-text2 text-[13px]">How fast your running volume grows</span>
        </div>
        <Segmented label="Ramp style" value={style} onChange={setStyle} options={RAMP_OPTIONS} />
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(130px,1fr))] gap-2.5">
        <StatTile label="This week" value={`${thisWeek.done.toFixed(1)} / ${thisWeek.plan.toFixed(0)} km`} />
        <StatTile label="Next week (projected)" value={`${nextWeekKm.toFixed(1)} km`} />
        <StatTile label="Longest run, 30 days" value={`${(run.longest30 ?? 0).toFixed(1)} km`} />
        <StatTile label="Single-run cap" value={`${run.singleRunCap} km`} />
      </div>

      <div className="fx-scrub pt-14" {...scrub.surface}>
        {tip && hi !== null && (
          <ChartTip left={pctLeft(bx(hi) + barW / 2, W, 12, 88)}>
            <strong className="font-bold">{tip.title}</strong>
            <br />
            {tip.line1}
            {tip.line2 && (
              <>
                <br />
                <span className="fx-text2">{tip.line2}</span>
              </>
            )}
          </ChartTip>
        )}
        <svg viewBox={`0 0 ${W} 236`} className="block h-auto w-full" role="img" aria-label={`Weekly running volume, ${currentIdx} weeks done and ${n - currentIdx - 1} projected. ${decision}`}>
          <path d={[10, 20, 30].map((k) => `M8 ${by(k).toFixed(1)}H${W - 8}`).join("")} className="fx-grid" />
          <text x="4" y={by(20) - 3} className="fx-ax">
            20
          </text>
          <text x="4" y={by(30) - 3} className="fx-ax">
            30
          </text>
          <line x1="8" y1={by(run.target)} x2={W - 8} y2={by(run.target)} className="fx-tgt" />
          <text x={W - 8} y={by(run.target) - 6} textAnchor="end" className="fx-ax-good">
            {run.targetLabel}
          </text>
          <path d={paths.plan || "M0 0"} className="fx-b-plan" />
          <path d={paths.hold || "M0 0"} className="fx-b-hold" />
          <path d={paths.act || "M0 0"} className="fx-b-act" />
          <path d={paths.todo || "M0 0"} className="fx-b-todo" />
          {hi !== null && (
            <path d={rectPath(bx(hi) - 2.5, by(Math.max(weeks[hi].km, 2)) - 3, barW + 5, BASE - by(Math.max(weeks[hi].km, 2)) + 3)} className="fx-b-hov" />
          )}
          {monthTicks.map((t) => (
            <text key={`${t.label}-${t.x}`} x={t.x} y="214" textAnchor="middle" className="fx-ax">
              {t.label}
            </text>
          ))}
          <text x={bx(currentIdx) + barW / 2} y="230" textAnchor="middle" className="fx-ax-strong">
            This week
          </text>
        </svg>
        <ScrubInput
          count={n}
          value={hi ?? currentIdx}
          onChange={scrub.onRangeChange}
          onBlur={scrub.clear}
          label="Scrub weekly running volume"
          valueText={describeWeek(hi ?? currentIdx).text}
        />
      </div>

      <p className="m-0 text-[15px] font-semibold leading-[1.45]">{decision}</p>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-6 gap-y-1">
        {gates.map((g) => (
          <div key={g.label} className="fx-gate">
            <span className="flex min-w-0 flex-col gap-px">
              <span className="text-sm font-semibold">{g.label}</span>
              <span className="fx-text2 text-xs">{g.detail}</span>
            </span>
            <span className={cn("fx-tag", g.status === "pass" && "fx-tag-good", g.status === "hold" && "fx-tag-warn")}>
              {g.status === "pass" ? "Pass" : g.status === "hold" ? "Hold" : "In progress"}
            </span>
          </div>
        ))}
      </div>

      <p className="fx-note">
        Why these rules: the classic 10% rule cut no injuries in a 532-runner trial, but jumps above 30% over two weeks and single runs more than 10% past your 30-day
        longest were both linked to more injuries. So the projection takes small weekly steps, lightens every fourth week, and caps any single run at 10% past
        your longest in the last 30 days.
      </p>
    </GlassCard>
  );
}
