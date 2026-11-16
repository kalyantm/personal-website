import { amount, sessionDay } from "./format";
import type { CallTone, Feel, Session, SessionVariant, WeekKey } from "./types";

export const FEELS: Record<Feel, { label: string; short: string }> = {
  easy: { label: "Easy", short: "Felt easy" },
  expected: { label: "As expected", short: "As expected" },
  harder: { label: "Harder than usual", short: "Felt harder" },
  tired: { label: "Too tired", short: "Too tired" },
  niggle: { label: "Niggle or pain", short: "Niggle" },
};

export const FEEL_ORDER: Feel[] = ["easy", "expected", "harder", "tired", "niggle"];

/** Morning check-in (1–5) → how today's session is handled. */
export function callTone(checkIn: number): CallTone {
  if (checkIn <= 1) return "stop";
  if (checkIn === 2) return "easy";
  return "go";
}

/** Read a free-text note for words that signal how a session felt. */
export function parseFeel(text: string): Feel | null {
  const s = text.toLowerCase();
  if (/pain|niggle|sore|ache|tight|twinge/.test(s)) return "niggle";
  if (/tired|exhaust|drained|wiped|no energy|fatigue/.test(s)) return "tired";
  if (/hard|heavy|struggl|tough|sluggish|labou?red/.test(s)) return "harder";
  if (/easy|fresh|great|strong|smooth|good/.test(s)) return "easy";
  return null;
}

export interface Adjustment {
  id: string;
  title: string;
  why: string;
  /** Info rows explain a decision but change nothing, so they can't be undone */
  info?: boolean;
  targetId?: string;
  patch?: Partial<Session>;
  active: boolean;
}

export interface PlanInput {
  sessions: Session[];
  feels: Record<string, Feel>;
  dismissed: Record<string, boolean>;
  tone: CallTone;
  cssScheduled: boolean;
  weekStarts: Record<WeekKey, string>;
}

export interface PlanResult {
  sessions: Session[];
  adjustments: Adjustment[];
  /** A completed run this week felt harder than usual, too tiring, or sore */
  runFlag: boolean;
  /** The run build should hold its next increase */
  holdRunBuild: boolean;
}

const isNegative = (f?: Feel) => f === "harder" || f === "tired";

function swap(target: Session, v: SessionVariant): Partial<Session> {
  return { title: v.title, plan: v.plan, unit: v.unit ?? target.unit, discipline: v.discipline ?? target.discipline };
}

/**
 * Turns this week's Garmin data, your session feels and today's check-in
 * into changes to next week. Every change carries a plain-language reason
 * and can be undone. Pure function: same input, same plan.
 */
export function buildPlan(input: PlanInput): PlanResult {
  const { sessions, feels, dismissed, tone, cssScheduled, weekStarts } = input;
  const day = (s: Session) => sessionDay(weekStarts[s.week], s.day);
  const weekday = (s: Session) => day(s).split(" ")[0];

  const feelValues = Object.values(feels);
  const doneRuns = sessions.filter((s) => s.week === "this" && s.discipline === "run" && s.status === "done");
  const negRuns = doneRuns.filter((s) => isNegative(feels[s.id]));
  const negAll = feelValues.filter(isNegative).length;
  const anyTired = feelValues.includes("tired");
  const niggle = feelValues.includes("niggle");
  const runFlag = doneRuns.some((s) => isNegative(feels[s.id]) || feels[s.id] === "niggle");
  const easyRuns = doneRuns.filter((s) => feels[s.id] === "easy").length;
  const moved = tone !== "go";

  const next = sessions.filter((s) => s.week === "next");
  const nextHard = next.find((s) => s.intensity === "hard");
  const nextLong = next.find((s) => s.intensity === "long");
  const nextSwim = next.find((s) => s.discipline === "swim");
  const todayMovable = sessions.find((s) => s.week === "this" && s.status === "today" && s.variants?.moved);

  const raw: Omit<Adjustment, "active">[] = [];

  if (nextHard) {
    const v = nextHard.variants ?? {};
    const label = `${day(nextHard)} · ${nextHard.title}`;
    if (niggle && v.crossTrain) {
      raw.push({
        id: "a-niggle",
        targetId: nextHard.id,
        patch: swap(nextHard, v.crossTrain),
        title: `${label} → ${v.crossTrain.title}`,
        why: "You logged a niggle. Impact comes out until a run feels normal again.",
      });
    } else if (anyTired && v.easy) {
      raw.push({
        id: "a-tired",
        targetId: nextHard.id,
        patch: swap(nextHard, v.easy),
        title: `${label} → ${v.easy.title}`,
        why: "You logged “too tired”. Hard sessions stay off the plan until your energy is back.",
      });
    } else if (moved && todayMovable?.variants?.moved) {
      const lighter = negRuns.length > 0 && todayMovable.variants.movedLighter;
      const mv = lighter ? todayMovable.variants.movedLighter! : todayMovable.variants.moved;
      raw.push({
        id: "a-moved",
        targetId: nextHard.id,
        patch: swap(nextHard, mv),
        title: `${label} → ${mv.title}`,
        why:
          "Today’s session moved after your check-in. It replaces this one instead of stacking on top." +
          (lighter ? ` One rep fewer, because ${weekday(negRuns[0])} felt hard.` : ""),
      });
    } else if (negRuns.length && v.lighter) {
      const x = negRuns[0];
      const effort = x.rpe && x.expectedRpe ? ` (effort ${x.rpe}/10, expected ${x.expectedRpe})` : "";
      raw.push({
        id: "a-harder",
        targetId: nextHard.id,
        patch: swap(nextHard, v.lighter),
        title: `${label} → ${v.lighter.title}`,
        why: `${weekday(x)}’s ${x.title} felt harder than usual${effort}. Effort rising at the same pace is an early fatigue sign.`,
      });
    }
  }

  if (nextLong?.variants?.shorter && (negAll >= 2 || anyTired)) {
    const s = nextLong.variants.shorter;
    raw.push({
      id: "a-long",
      targetId: nextLong.id,
      patch: swap(nextLong, s),
      title: `${day(nextLong)} · ${nextLong.title.toLowerCase()} ${amount(nextLong.plan, nextLong.unit)} → ${amount(s.plan, s.unit ?? nextLong.unit)}`,
      why: "Two or more sessions felt hard this week. Trim the long run, keep the habit.",
    });
  }

  if (runFlag) {
    raw.push({
      id: "a-hold",
      title: "Run build · next increase waits a week",
      why: "A run felt harder than usual. The next volume increase holds for one extra week.",
    });
  }

  if (cssScheduled && nextSwim?.variants?.test) {
    raw.push({
      id: "a-css",
      targetId: nextSwim.id,
      patch: swap(nextSwim, nextSwim.variants.test),
      title: `${day(nextSwim)} · ${nextSwim.title.toLowerCase()} → CSS test`,
      why: "Scheduled from Progress markers. Gives your swim zones a real anchor.",
    });
  }

  const skipped = sessions.find((s) => s.week === "this" && s.status === "skipped");
  if (skipped) {
    raw.push({
      id: "i-missed",
      info: true,
      title: `${weekday(skipped)}’s missed ${skipped.title.toLowerCase()} isn’t added back`,
      why: "Squeezing a missed session into the next few days adds load you don’t need.",
    });
  }

  if (!runFlag && !anyTired && !niggle && easyRuns >= 2) {
    raw.push({
      id: "i-good",
      info: true,
      title: "Runs feel easy: the next increase stays on schedule",
      why: "Two easy-feeling runs and recovery in your band.",
    });
  }

  const adjustments: Adjustment[] = raw.map((a) => ({ ...a, active: a.info ? true : !dismissed[a.id] }));

  const out = sessions.map((s) => ({ ...s }));
  for (const a of adjustments) {
    if (!a.active || !a.targetId || !a.patch) continue;
    const s = out.find((x) => x.id === a.targetId);
    if (!s) continue;
    if (!s.adjusted) s.previousTitle = s.title;
    Object.assign(s, a.patch, { adjusted: true, reason: a.why });
  }

  if (moved) {
    const target = nextHard ? weekday(nextHard) : "later";
    for (const s of out) {
      if (s.week !== "this" || s.status !== "today") continue;
      if (tone === "stop" || s.variants?.moved) {
        s.status = "moved";
        s.actual = `Moved to ${target} after your check-in`;
      }
    }
  }

  return { sessions: out, adjustments, runFlag, holdRunBuild: runFlag && !dismissed["a-hold"] };
}
