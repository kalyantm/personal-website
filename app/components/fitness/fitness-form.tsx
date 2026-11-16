import { useMemo, useState, type ReactNode } from "react";
import { Toggle } from "~/components/ui/toggle";
import { cn } from "~/lib/utils";
import { pctLeft, rectPath, smoothPath } from "~/lib/fitness/chart";
import { addDays, dayLabel, formMeaning, MONTHS, signed, signedFixed } from "~/lib/fitness/format";
import type { DashboardData } from "~/lib/fitness/types";
import { ChartTip, GlassCard, ScrubInput, StatTile, useScrub } from "./ui/primitives";

const W = 760;
type Series = "fitness" | "fatigue" | "form";

const SERIES: { key: Series; label: string; swatch: string }[] = [
  { key: "fitness", label: "Fitness", swatch: "fx-bg-swim" },
  { key: "fatigue", label: "Fatigue", swatch: "fx-bg-atl" },
  { key: "form", label: "Form", swatch: "fx-bg-form" },
];

export function FitnessForm({ load, info }: { load: DashboardData["load"]; info?: ReactNode }) {
  const [show, setShow] = useState<Record<Series, boolean>>({ fitness: true, fatigue: true, form: true });
  const { days, todayIndex: today, raceIndex: race, startDate } = load;
  const projected = load.projected !== false && race < days.length;
  const n = days.length;
  const x = (i: number) => 8 + ((W - 16) * i) / (n - 1);

  const g = useMemo(() => {
    const all = days.flatMap((d) => [d.fitness, d.fatigue]);
    const lo = Math.floor(Math.min(...all) - 4);
    const hi = Math.ceil(Math.max(...all) + 4);
    const y = (v: number) => 12 + (168 - 12) * (1 - (v - lo) / (hi - lo));
    const seg = (key: "fitness" | "fatigue", a: number, b: number) => smoothPath(days.slice(a, b + 1).map((d, j) => [x(a + j), y(d[key])]));
    const formMax = Math.max(...days.map((d) => Math.abs(d.form))) || 1;
    const bars = { posH: "", negH: "", posP: "", negP: "" };
    days.forEach((d, i) => {
      const h = Math.max(1, (Math.abs(d.form) / formMax) * 28);
      const r = rectPath(x(i) - 2.4, d.form >= 0 ? 222 - h : 222, 4.8, h);
      if (i <= today) {
        if (d.form >= 0) bars.posH += r;
        else bars.negH += r;
      } else if (d.form >= 0) bars.posP += r;
      else bars.negP += r;
    });
    const ticks = [0.2, 0.5, 0.8].map((k) => Math.round(lo + (hi - lo) * k));
    return {
      y,
      ticks,
      bars,
      fitHist: seg("fitness", 0, today),
      fitProj: seg("fitness", today, n - 1),
      fatHist: seg("fatigue", 0, today),
      fatProj: seg("fatigue", today, n - 1),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [days, today, n]);

  const scrub = useScrub(n, 8 / W);
  const i = scrub.index ?? today;
  const d = days[i];
  const when = `${dayLabel(addDays(startDate, i))}${i > today ? " · projected" : i === today ? " · today" : ""}`;
  const meaning = formMeaning(d.form);
  const ramp = days[today].fitness - days[Math.max(0, today - 7)].fitness;
  const projX = (x(today) + x(today + 1)) / 2;
  const tickIdx = [0, Math.round(n / 3), Math.round((2 * n) / 3)];
  const load7 = (load.dailyLoad ?? []).slice(Math.max(0, today - 6), today + 1).reduce((a, b) => a + b, 0);

  const toggle = (k: Series) => setShow((s) => ({ ...s, [k]: !s[k] }));

  return (
    <GlassCard labelledBy="form-h" delay={0.34} className="flex flex-col gap-4 rounded-[28px] p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="form-h" className="fx-card-h flex items-center gap-2">
          Fitness and form
          {info}
        </h2>
        <div role="group" aria-label="Show series" className="flex flex-wrap gap-1.5">
          {SERIES.map((s) => (
            <Toggle key={s.key} pressed={show[s.key]} onPressedChange={() => toggle(s.key)} className="fx-tog">
              <span className={cn("fx-sw", s.swatch)} aria-hidden="true" />
              {s.label}
            </Toggle>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(120px,1fr))] gap-2.5">
        <StatTile size="lg" label="Fitness" value={String(Math.round(days[today].fitness))} />
        <StatTile size="lg" label="Fatigue" value={String(Math.round(days[today].fatigue))} />
        <StatTile size="lg" label="Form today" value={signed(days[today].form)} />
        {projected ? (
          <StatTile size="lg" label="Race-day form" value={signed(days[race].form)} />
        ) : (
          <StatTile size="lg" label="Load, last 7 days" value={String(Math.round(load7))} />
        )}
        <StatTile size="lg" label="7-day ramp" value={signedFixed(ramp)} />
      </div>

      <div className="flex flex-wrap items-stretch gap-5">
        <div className="fx-scrub min-w-0 flex-[2.4_1_560px] pt-[74px]" {...scrub.surface}>
          {scrub.index !== null && (
            <ChartTip left={pctLeft(x(i), W, 14, 86)}>
              <strong className="font-bold">{when}</strong>
              <br />
              Fitness <strong className="fx-num">{Math.round(d.fitness)}</strong> · Fatigue <strong className="fx-num">{Math.round(d.fatigue)}</strong> · Form{" "}
              <strong className="fx-num">{signed(d.form)}</strong>
              <br />
              <span className="fx-text2">{meaning}</span>
            </ChartTip>
          )}
          <svg
            viewBox={`0 0 ${W} 280`}
            className="block h-auto w-full"
            role="img"
            aria-label={
              projected
                ? `Fitness, fatigue and form over ${today + 1} days with a projected taper to race day. Form today ${signed(days[today].form)}, projected race-day form ${signed(days[race].form)}.`
                : `Fitness, fatigue and form over the last ${n} days from Garmin training load. Form today ${signed(days[today].form)}.`
            }
          >
            {projected && (
              <>
                <rect x={projX} y="2" width={W - projX} height="256" rx="10" className="fx-proj-bg" />
                <text x={(projX + W) / 2} y="18" textAnchor="middle" className="fx-ax">
                  Projected
                </text>
              </>
            )}
            <path d={g.ticks.map((t) => `M8 ${g.y(t).toFixed(1)}H${W - 8}`).join("")} className="fx-grid" />
            {g.ticks.map((t) => (
              <text key={t} x="10" y={g.y(t) - 4} className="fx-ax">
                {t}
              </text>
            ))}
            <line x1="8" y1="222" x2={W - 8} y2="222" className="fx-grid" />
            <text x="10" y="196" className="fx-ax">
              Form
            </text>
            {show.form && (
              <>
                <path d={g.bars.posH || "M0 0"} className="fx-bar-pos" />
                <path d={g.bars.negH || "M0 0"} className="fx-bar-neg" />
                <path d={g.bars.posP || "M0 0"} className="fx-bar-pos fx-proj" />
                <path d={g.bars.negP || "M0 0"} className="fx-bar-neg fx-proj" />
              </>
            )}
            {show.fatigue && (
              <>
                <path d={g.fatHist} className="fx-ln-atl" />
                <path d={g.fatProj} className="fx-ln-atl fx-dash" />
              </>
            )}
            {show.fitness && (
              <>
                <path d={g.fitHist} className="fx-ln-ctl" />
                <path d={g.fitProj} className="fx-ln-ctl fx-dash" />
              </>
            )}
            <line x1={x(today)} y1="10" x2={x(today)} y2="252" className="fx-mark" />
            {scrub.index !== null && (
              <>
                <line x1={x(i)} y1="10" x2={x(i)} y2="252" className="fx-hov" />
                {show.fitness && <circle cx={x(i)} cy={g.y(d.fitness)} r="4.5" className="fx-dot-ctl" />}
                {show.fatigue && <circle cx={x(i)} cy={g.y(d.fatigue)} r="4.5" className="fx-dot-atl" />}
              </>
            )}
            {tickIdx.map((t, k) => {
              const date = addDays(startDate, t);
              return (
                <text key={t} x={x(t)} y="274" textAnchor={k === 0 ? "start" : "middle"} className="fx-ax">
                  {`${MONTHS[date.getMonth()]} ${date.getDate()}`}
                </text>
              );
            })}
            <text x={x(today) - 4} y="274" textAnchor="end" className="fx-ax-strong">
              Today
            </text>
            {projected && (
              <text x={W - 8} y="274" textAnchor="end" className="fx-ax-strong">
                {load.raceLabel}
              </text>
            )}
          </svg>
          <ScrubInput
            count={n}
            value={i}
            onChange={scrub.onRangeChange}
            onBlur={scrub.clear}
            label="Scrub fitness, fatigue and form by day"
            valueText={`${when}: fitness ${Math.round(d.fitness)}, fatigue ${Math.round(d.fatigue)}, form ${signed(d.form)}. ${meaning}`}
          />
        </div>

        <div className="flex flex-[1_1_240px] flex-col justify-center gap-2.5">
          <Explainer swatch="fx-bg-swim" title="Fitness">
            Your average training load over about six weeks. It rises slowly, and it&apos;s the number you&apos;re building.
          </Explainer>
          <Explainer swatch="fx-bg-atl" title="Fatigue">
            Your load over the last week. It jumps after hard days and drops fast when you rest.
          </Explainer>
          <Explainer swatch="fx-bg-form" title="Form">
            Fitness minus fatigue. Negative in hard weeks is normal; aim for +10 to +25 on race day.
          </Explainer>
        </div>
      </div>
    </GlassCard>
  );
}

function Explainer({ swatch, title, children }: { swatch: string; title: string; children: ReactNode }) {
  return (
    <div className="fx-inset flex flex-col gap-1 rounded-2xl px-4 py-3.5">
      <span className="flex items-center gap-2 text-sm font-bold">
        <span className={cn("fx-sw", swatch)} aria-hidden="true" />
        {title}
      </span>
      <span className="fx-note">{children}</span>
    </div>
  );
}
