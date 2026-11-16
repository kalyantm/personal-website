import { useMemo, useState, type ChangeEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { cn } from "~/lib/utils";
import { addDays, amount, dayLabel as fullDayLabel, sessionDay } from "~/lib/fitness/format";
import { FEEL_ORDER, FEELS, parseFeel, type Adjustment } from "~/lib/fitness/plan-engine";
import { DISCIPLINES, disciplineProgress, type DisciplineProgress } from "~/lib/fitness/week";
import type { Discipline, Feel, Session, SessionStatus, WeekKey } from "~/lib/fitness/types";
import { GlassCard, Segmented } from "./ui/primitives";

type Tab = "all" | Discipline;

const TAB_OPTIONS: { value: Tab; label: string }[] = [
  { value: "all", label: "All" },
  ...DISCIPLINES.map((d) => ({ value: d.id as Tab, label: d.name })),
];

const STATUS_LABEL: Record<SessionStatus, string> = {
  done: "Done",
  today: "Today",
  planned: "Planned",
  skipped: "Skipped",
  moved: "Moved",
};

const STATUS_TAG: Record<SessionStatus, string> = {
  done: "fx-tg fx-tg-done",
  today: "fx-tg fx-tg-today",
  planned: "fx-tg",
  skipped: "fx-tg fx-tg-skip",
  moved: "fx-tg fx-tg-skip",
};

const DISCIPLINE_NAME: Record<Discipline, string> = { run: "Run", bike: "Bike", swim: "Swim", gym: "Strength" };

export interface WeekPlannerProps {
  sessions: Session[];
  feels: Record<string, Feel>;
  notes: Record<string, string>;
  adjustments: Adjustment[];
  weekStarts: Record<WeekKey, string>;
  weekLabels: Record<WeekKey, { title: string; sub: string }>;
  initialSelected: string;
  onFeel: (sessionId: string, feel: Feel | null) => void;
  onSaveNote: (sessionId: string, text: string, parsedFeel: Feel | null) => void;
  onToggleAdjustment: (adjustmentId: string) => void;
}

export function WeekPlanner({
  sessions,
  feels,
  notes,
  adjustments,
  weekStarts,
  weekLabels,
  initialSelected,
  onFeel,
  onSaveNote,
  onToggleAdjustment,
}: WeekPlannerProps) {
  const [view, setView] = useState<WeekKey>("this");
  const [tab, setTab] = useState<Tab>("all");
  const [selectedId, setSelectedId] = useState(initialSelected);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [saved, setSaved] = useState<{ id: string; msg: string } | null>(null);

  const viewSessions = useMemo(() => sessions.filter((s) => s.week === view), [sessions, view]);
  const visible = viewSessions.filter((s) => tab === "all" || s.discipline === tab);
  const selected = visible.find((s) => s.id === selectedId) ?? visible[0] ?? viewSessions[0];
  const progress = useMemo(() => disciplineProgress(viewSessions, feels), [viewSessions, feels]);
  const activeCount = adjustments.filter((a) => !a.info && a.active).length;

  const dayLabels = Array.from({ length: 7 }, (_, i) => sessionDay(weekStarts[view], i));

  return (
    <GlassCard labelledBy="week-h" delay={0.1} className="flex flex-col gap-[18px] rounded-[28px] p-[clamp(18px,2.2vw,26px)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <h2 id="week-h" className="fx-card-h">
            {weekLabels[view].title}
          </h2>
          <span className="fx-text2 text-[13px]">{weekLabels[view].sub}</span>
        </div>
        <Segmented
          label="Which week"
          value={view}
          onChange={(v) => {
            setView(v);
            setSaved(null);
          }}
          options={[
            { value: "this", label: "This week" },
            { value: "next", label: "Next week" },
          ]}
        />
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
                  {formatProgress(p)} · <strong className="text-[color:var(--fx-text)]">{p.pct === null ? "—" : `${p.pct}%`}</strong>
                </span>
              </div>
              <ProgressBar progress={p} />
            </div>
          ))}
        </div>
      ) : (
        <SingleProgress progress={progress.find((p) => p.discipline === tab)!} />
      )}

      <div className="fx-text2 flex flex-wrap items-center gap-4 text-xs">
        <span className="inline-flex items-center gap-1.5">
          <span className="fx-bg-text2 h-2 w-[18px] rounded" aria-hidden="true" />
          Done
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="fx-pseg fx-bg-text2 h-2 w-[18px] rounded" data-state="todo" aria-hidden="true" />
          Planned
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="fx-pseg h-2 w-[18px] rounded" data-state="miss" aria-hidden="true" />
          Skipped or moved
        </span>
      </div>

      {/* Week board: scrolls sideways on small screens */}
      <div className="overflow-x-auto px-0.5 pb-1.5 pt-0.5">
        <div className="grid min-w-[860px] grid-cols-7 gap-2">
          {dayLabels.map((label, day) => {
            const all = viewSessions.filter((s) => s.day === day);
            const list = all.filter((s) => tab === "all" || s.discipline === tab);
            const [weekday, date] = label.split(" ");
            return (
              <div key={label} className="flex flex-col gap-1.5">
                <div className="fx-dayh" data-today={view === "this" && day === 6 ? "true" : undefined}>
                  <span>{weekday}</span>
                  <span className="fx-num">{date}</span>
                </div>
                {list.map((s) => (
                  <SessionChip
                    key={s.id}
                    session={s}
                    dayLabel={label}
                    feel={feels[s.id]}
                    selected={s.id === selected?.id}
                    onSelect={() => {
                      setSelectedId(s.id);
                      setSaved(null);
                    }}
                  />
                ))}
                {list.length === 0 && (
                  <div className="fx-text3 rounded-[14px] border border-dashed border-[color:var(--fx-track)] px-[11px] py-2.5 text-[13px]">
                    {all.length === 0 ? "Rest" : "—"}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-stretch gap-4">
        {selected && (
          <div className="fx-inset flex min-w-0 flex-[1.6_1_520px] flex-col gap-4 rounded-[22px] p-[18px]">
            <AnimatePresence exitBeforeEnter initial={false}>
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              >
                <SessionDetail
                  session={selected}
                  dateLabel={fullDayLabel(addDays(weekStarts[selected.week], selected.day))}
                  feel={feels[selected.id]}
                  note={notes[selected.id]}
                  draft={drafts[selected.id] ?? notes[selected.id] ?? ""}
                  savedMsg={saved?.id === selected.id ? saved.msg : ""}
                  onDraft={(text) => {
                    setDrafts((d) => ({ ...d, [selected.id]: text }));
                    setSaved(null);
                  }}
                  onFeel={(f) => {
                    onFeel(selected.id, f);
                    setSaved(null);
                  }}
                  onSave={() => {
                    const text = (drafts[selected.id] ?? notes[selected.id] ?? "").trim();
                    const canRate = selected.status === "done" || selected.status === "today";
                    const parsed = canRate && text ? parseFeel(text) : null;
                    onSaveNote(selected.id, text, parsed);
                    setSaved({
                      id: selected.id,
                      msg: parsed ? `Saved. Read as “${FEELS[parsed].label.toLowerCase()}”, plan updated.` : text ? "Saved." : "Note cleared.",
                    });
                  }}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        )}

        <div className="fx-inset flex min-w-0 flex-[1_1_320px] flex-col gap-2.5 rounded-[22px] p-[18px]">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="m-0 text-base font-bold">Plan updates</h3>
            <span className="fx-tag">{activeCount} active</span>
          </div>
          <p className="fx-note">Built from Garmin data, your notes and today&apos;s check-in. Undo anything you disagree with.</p>
          <ul aria-live="polite" className="m-0 flex list-none flex-col gap-2 p-0">
            <AnimatePresence initial={false}>
              {adjustments.map((a) => (
                <motion.li
                  key={a.id}
                  layout
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  className="fx-adj"
                  data-active={a.active ? "true" : "false"}
                >
                  <span className={cn("fx-sdot mt-1.5", a.info || !a.active ? "fx-sdot-neutral" : "fx-sdot-warn")} aria-hidden="true" />
                  <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <span className="fx-adj-title text-sm font-semibold leading-[1.3]">{a.title}</span>
                    <span className="fx-text2 text-[12.5px] leading-[1.4]">{a.why}</span>
                  </div>
                  {!a.info && (
                    <Button
                      type="button"
                      className="fx-btn fx-btn-ghost fx-btn-sm"
                      aria-label={`${a.active ? "Undo" : "Restore"}: ${a.title}`}
                      onClick={() => onToggleAdjustment(a.id)}
                    >
                      {a.active ? "Undo" : "Restore"}
                    </Button>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        </div>
      </div>
    </GlassCard>
  );
}

function formatProgress(p: DisciplineProgress): string {
  const done = p.unit === "km" ? p.done.toFixed(1) : String(Math.round(p.done));
  return `${done} / ${amount(p.total, p.unit)}`;
}

function ProgressBar({ progress, tall }: { progress: DisciplineProgress; tall?: boolean }) {
  const doneLabel = amount(progress.done, progress.unit);
  const totalLabel = amount(progress.total, progress.unit);
  return (
    <div className={cn("fx-pbar", tall && "h-4")} role="img" aria-label={`${progress.name}: ${doneLabel} done of ${totalLabel} planned`}>
      {progress.segments.map((seg) => (
        <motion.div
          key={seg.id}
          className={cn("fx-pseg", `fx-bg-${progress.discipline}`)}
          data-state={seg.state}
          initial={false}
          animate={{ width: `${seg.width}%` }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
        />
      ))}
    </div>
  );
}

function SingleProgress({ progress }: { progress: DisciplineProgress }) {
  return (
    <div className="flex flex-wrap items-end gap-5">
      <div className="flex min-w-[180px] flex-col gap-0.5">
        <span className="fx-label">{progress.name} this week</span>
        <span className="fx-num text-4xl font-bold tracking-[-0.03em]">
          {amount(progress.done, progress.unit)} <span className="fx-text2 text-base font-medium">of {amount(progress.total, progress.unit)}</span>
        </span>
      </div>
      <div className="flex flex-[1_1_320px] flex-col gap-2">
        <ProgressBar progress={progress} tall />
        <div className="fx-text2 flex flex-wrap gap-4 text-[13px]">
          <span>
            {progress.sessionsDone} of {progress.sessionsTotal} sessions done
          </span>
          <span>{progress.avgEffort === null ? "No efforts logged yet" : `Avg effort ${progress.avgEffort.toFixed(1)}/10`}</span>
          <span>{progress.flagged ? `${progress.flagged} felt harder than expected` : "Nothing flagged"}</span>
        </div>
      </div>
    </div>
  );
}

function SessionChip({
  session: s,
  dayLabel,
  feel,
  selected,
  onSelect,
}: {
  session: Session;
  dayLabel: string;
  feel?: Feel;
  selected: boolean;
  onSelect: () => void;
}) {
  const showAmount = s.status !== "skipped" && s.status !== "moved";
  return (
    <button
      type="button"
      className="fx-sess"
      data-status={s.status}
      data-adjusted={s.adjusted ? "true" : undefined}
      aria-pressed={selected}
      aria-label={`${dayLabel}: ${s.title}, ${STATUS_LABEL[s.status]}${s.adjusted ? ", adjusted" : ""}`}
      onClick={onSelect}
    >
      <span className="flex w-full items-center gap-1.5">
        <span className={cn("fx-dot", `fx-bg-${s.discipline}`)} aria-hidden="true" />
        <span className="text-[13px] font-semibold leading-[1.25]">{s.title}</span>
      </span>
      {showAmount && <span className="fx-num fx-text2 text-xs">{amount(s.plan, s.unit)}</span>}
      <span className="flex flex-wrap gap-1">
        <span className={STATUS_TAG[s.status]}>{STATUS_LABEL[s.status]}</span>
        {s.adjusted && <span className="fx-tg fx-tg-adj">Adjusted</span>}
        {feel && feel !== "expected" && <span className={cn("fx-fb", `fx-fb-${feel}`)}>{FEELS[feel].short}</span>}
      </span>
    </button>
  );
}

function SessionDetail({
  session: s,
  dateLabel,
  feel,
  note,
  draft,
  savedMsg,
  onDraft,
  onFeel,
  onSave,
}: {
  session: Session;
  dateLabel: string;
  feel?: Feel;
  note?: string;
  draft: string;
  savedMsg: string;
  onDraft: (text: string) => void;
  onFeel: (feel: Feel | null) => void;
  onSave: () => void;
}) {
  const canRate = s.status === "done" || s.status === "today";
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-col gap-1">
          <span className="fx-label">
            {dateLabel} · {DISCIPLINE_NAME[s.discipline]}
          </span>
          <h3 className="m-0 flex items-center gap-2 text-xl font-bold tracking-[-0.02em]">
            <span className={cn("fx-dot h-2.5 w-2.5", `fx-bg-${s.discipline}`)} aria-hidden="true" />
            {s.title}
          </h3>
        </div>
        <span className={STATUS_TAG[s.status]}>{STATUS_LABEL[s.status]}</span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(240px,1fr))] gap-[18px]">
        <div className="flex flex-col gap-2.5">
          <p className="fx-label">From Garmin</p>
          <Row label="Planned" value={`${amount(s.plan, s.unit)}${s.adjusted && s.previousTitle ? ` (was ${s.previousTitle})` : ""}`} />
          <Row label="Actual" value={s.actual ?? "Not done yet"} />
          <Row label="Self-evaluation" value={s.rpe ? `Effort ${s.rpe}/10 · felt ${s.garminFeel ?? "Normal"}` : "None yet"} />
          {s.garminNote && (
            <p className="m-0 rounded-xl bg-[color:var(--fx-track)] px-3 py-2.5 text-sm leading-[1.45]">
              “{s.garminNote}” <span className="fx-text3">· note on watch</span>
            </p>
          )}
          {note && (
            <p className="m-0 rounded-xl bg-[color:var(--fx-track)] px-3 py-2.5 text-sm leading-[1.45]">
              “{note}” <span className="fx-text3">· your note</span>
            </p>
          )}
          {s.adjusted && s.reason && <p className="fx-warn m-0 text-[13px] leading-[1.45]">{s.reason}</p>}
        </div>

        <div className="flex flex-col gap-2.5">
          <p id="feel-label" className="fx-label">
            How did it feel?
          </p>
          <ToggleGroup
            type="single"
            value={feel ?? ""}
            onValueChange={(v: string) => onFeel(v ? (v as Feel) : null)}
            disabled={!canRate}
            aria-labelledby="feel-label"
            className="fx-feel-group flex"
          >
            {FEEL_ORDER.map((f) => (
              <ToggleGroupItem key={f} value={f} className="fx-feel">
                {FEELS[f].label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          {!canRate && <p className="fx-note">You can rate it once it&apos;s done. Notes work any time, like “can&apos;t make Tuesday”.</p>}
          <Label htmlFor="session-note" className="fx-text2 text-[13px] font-normal">
            Note · read for words like “harder”, “tired”, “sore”
          </Label>
          <Textarea
            id="session-note"
            className="fx-ta"
            placeholder="e.g. run felt harder than usual"
            value={draft}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => onDraft(e.target.value)}
          />
          <div className="flex flex-wrap items-center gap-3">
            <Button type="button" className="fx-btn" onClick={onSave}>
              Save and re-plan
            </Button>
            <span role="status" className="fx-good text-[13px]">
              {savedMsg}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-2.5 text-sm">
      <span className="fx-text2">{label}</span>
      <span className="fx-num text-right">{value}</span>
    </div>
  );
}
