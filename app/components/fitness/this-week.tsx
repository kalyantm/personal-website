import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import { mmss, sessionDay } from "~/lib/fitness/format";
import type { ActivityKind, Discipline, WeekActivity, WeekData } from "~/lib/fitness/types";
import { ThisWeekInfo } from "./section-info";
import { GlassCard, Segmented } from "./ui/primitives";

/**
 * Phase 1 week view: what actually happened this week, from Garmin activities,
 * measured against fixed weekly targets. No planned or future sessions.
 */

type Tab = "all" | Discipline;

const DISCIPLINES: { id: Discipline; name: string }[] = [
  { id: "run", name: "Run" },
  { id: "bike", name: "Bike" },
  { id: "swim", name: "Swim" },
  { id: "gym", name: "Strength" },
];

const TAB_OPTIONS: { value: Tab; label: string }[] = [{ value: "all", label: "All" }, ...DISCIPLINES.map((d) => ({ value: d.id as Tab, label: d.name }))];

const KIND_NAME: Record<ActivityKind, string> = { run: "Run", bike: "Bike", swim: "Swim", gym: "Strength", other: "Other" };

interface Progress {
  discipline: Discipline;
  name: string;
  done: number;
  target: number;
  unit: "km" | "sessions";
  /** Width of each activity's segment, as a share of the bar (0–100) */
  segments: { id: string; width: number }[];
  pct: number | null;
  count: number;
}

function progressFor(week: WeekData): Progress[] {
  return DISCIPLINES.map(({ id, name }) => {
    const { amount: target, unit } = week.targets[id];
    const acts = week.activities.filter((a) => a.kind === id);
    const amountOf = (a: WeekActivity) => (unit === "sessions" ? 1 : a.distanceKm ?? 0);
    const done = acts.reduce((s, a) => s + amountOf(a), 0);
    // Past the target, segments share the full bar
    const scale = Math.max(target, done) || 1;
    return {
      discipline: id,
      name,
      done,
      target,
      unit,
      segments: acts.map((a) => ({ id: a.id, width: (amountOf(a) / scale) * 100 })),
      pct: target ? Math.round((done / target) * 100) : null,
      count: acts.length,
    };
  });
}

const fmtAmount = (v: number, unit: "km" | "sessions") => (unit === "km" ? `${v.toFixed(1)} km` : `${v} ${v === 1 ? "session" : "sessions"}`);

export function ThisWeek({ week }: { week: WeekData }) {
  const [tab, setTab] = useState<Tab>("all");
  const progress = useMemo(() => progressFor(week), [week]);
  const dayLabels = Array.from({ length: 7 }, (_, i) => sessionDay(week.start, i));

  return (
    <GlassCard labelledBy="week-h" delay={0.1} className="flex flex-col gap-[18px] rounded-[28px] p-[clamp(18px,2.2vw,26px)]">
      <div className="flex flex-col gap-0.5">
        <h2 id="week-h" className="fx-card-h flex items-center gap-2">
          {week.title}
          <ThisWeekInfo />
        </h2>
        <span className="fx-text2 text-[13px]">{week.sub}</span>
      </div>

      <Segmented label="Discipline" value={tab} onChange={setTab} options={TAB_OPTIONS} className="self-start" />

      {tab === "all" ? (
        <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-x-6 gap-y-3.5">
          {progress.map((p) => (
            <div key={p.discipline} className="flex flex-col gap-[7px]">
              <div className="flex items-baseline justify-between gap-2">
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <span className={cn("fx-dot", `fx-bg-${p.discipline}`)} aria-hidden="true" />
                  {p.name}
                </span>
                <span className="fx-num fx-text2 text-[13px]">
                  <ProgressText p={p} />
                </span>
              </div>
              <Bar p={p} />
            </div>
          ))}
        </div>
      ) : (
        <SingleProgress p={progress.find((p) => p.discipline === tab)!} activities={week.activities.filter((a) => a.kind === tab)} />
      )}

      {/* Week board: scrolls sideways on small screens */}
      <div className="overflow-x-auto px-0.5 pb-1.5 pt-0.5">
        <div className="grid min-w-[860px] grid-cols-7 gap-2">
          {dayLabels.map((label, day) => {
            const list = week.activities.filter((a) => a.day === day && (tab === "all" || a.kind === tab));
            const [weekday, date] = label.split(" ");
            const future = day > week.todayIndex;
            return (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="fx-dayh" data-today={day === week.todayIndex ? "true" : undefined}>
                  <span>{weekday}</span>
                  <span className="fx-num">{date}</span>
                </div>
                {list.map((a) => (
                  <ActivityCard key={a.id} activity={a} dayLabel={label} />
                ))}
                {list.length === 0 && !future && (
                  <div className="fx-text3 rounded-[14px] border border-dashed border-[color:var(--fx-track)] px-[11px] py-2.5 text-[13px]">
                    {day === week.todayIndex ? "Nothing yet" : "Rest"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </GlassCard>
  );
}

function ProgressText({ p }: { p: Progress }) {
  if (!p.target) return <>{p.count ? fmtAmount(p.done, p.unit) : "Not started"}</>;
  return (
    <>
      {p.unit === "km" ? `${p.done.toFixed(1)} / ${p.target} km` : `${p.done} / ${p.target}`} ·{" "}
      <strong className="text-[color:var(--fx-text)]">{p.pct}%</strong>
    </>
  );
}

function Bar({ p, tall = false }: { p: Progress; tall?: boolean }) {
  const label = p.target ? `${p.name}: ${fmtAmount(p.done, p.unit)} of ${fmtAmount(p.target, p.unit)}` : `${p.name}: no target yet`;
  return (
    <div className={cn("fx-pbar", tall && "h-4")} role="img" aria-label={label}>
      {p.segments.map((seg) => (
        <motion.div
          key={seg.id}
          className={cn("fx-pseg", `fx-bg-${p.discipline}`)}
          data-state="done"
          initial={false}
          animate={{ width: `${seg.width}%` }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        />
      ))}
    </div>
  );
}

function SingleProgress({ p, activities }: { p: Progress; activities: WeekActivity[] }) {
  const minutes = activities.reduce((s, a) => s + a.durationMin, 0);
  return (
    <div className="flex flex-wrap items-end gap-5">
      <div className="flex min-w-[180px] flex-col gap-0.5">
        <span className="fx-label">{p.name} this week</span>
        <span className="fx-num text-4xl font-bold tracking-[-0.03em]">
          {fmtAmount(p.done, p.unit)}{" "}
          {p.target > 0 && <span className="fx-text2 text-base font-medium">of {fmtAmount(p.target, p.unit)}</span>}
        </span>
      </div>
      <div className="flex flex-[1_1_320px] flex-col gap-2">
        <Bar p={p} tall />
        <div className="fx-text2 flex flex-wrap gap-4 text-[13px]">
          <span>
            {activities.length} {activities.length === 1 ? "activity" : "activities"}
          </span>
          <span>{Math.round(minutes)} min total</span>
          {!p.target && <span>No target yet</span>}
        </div>
      </div>
    </div>
  );
}

function ActivityCard({ activity: a, dayLabel }: { activity: WeekActivity; dayLabel: string }) {
  const amount = a.distanceKm ? `${a.distanceKm.toFixed(1)} km · ${Math.round(a.durationMin)} min` : `${Math.round(a.durationMin)} min`;
  const detail = [
    a.paceSecPerKm ? `${mmss(a.paceSecPerKm)} /km` : null,
    a.speedKmh ? `${a.speedKmh.toFixed(1)} km/h` : null,
    a.avgHr ? `${a.avgHr} bpm` : null,
  ]
    .filter(Boolean)
    .join(" · ");
  return (
    <div className="fx-sess cursor-default" data-status="done" aria-label={`${dayLabel}: ${a.title}, ${amount}`}>
      <span className="flex w-full items-center gap-1.5">
        <span className={cn("fx-dot", a.kind === "other" ? "fx-bg-text2" : `fx-bg-${a.kind}`)} aria-hidden="true" />
        <span className="text-[13px] font-semibold leading-[1.25]">{a.title}</span>
      </span>
      <span className="fx-num fx-text2 text-xs">{amount}</span>
      {detail && <span className="fx-num fx-text3 text-xs">{detail}</span>}
      <span className="flex flex-wrap gap-1">
        <span className="fx-tg fx-tg-done">{KIND_NAME[a.kind]}</span>
        <span className="fx-tg">{a.time}</span>
      </span>
    </div>
  );
}
