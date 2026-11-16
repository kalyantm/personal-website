import { AnimatePresence, motion } from "framer-motion";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { cn } from "~/lib/utils";
import type { CallTone, Tone, TodayVariant } from "~/lib/fitness/types";
import { GlassCard } from "./ui/primitives";

export interface CallReason {
  label: string;
  value: string;
  detail: string;
  tone: Tone;
}

export function TodaysCall({
  tone,
  variant,
  garmin,
  checkIn,
  onCheckIn,
  reasons,
}: {
  tone: CallTone;
  variant: TodayVariant;
  garmin: { readiness: number; readinessLabel: string; suggestion: string };
  checkIn: number;
  onCheckIn: (value: number) => void;
  reasons: CallReason[];
}) {
  return (
    <GlassCard labelledBy="call-h" delay={0.04} className="flex flex-col gap-[22px] rounded-[32px] p-[clamp(20px,2.4vw,30px)]">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex min-w-0 flex-[999_1_420px] flex-col gap-2.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <span className={cn("fx-pill", `fx-pill-${tone}`)}>{variant.pill}</span>
            <span className="fx-text2 text-[13px]">Today&apos;s call · your plan first</span>
          </div>
          <AnimatePresence exitBeforeEnter initial={false}>
            <motion.div
              key={variant.title}
              className="flex flex-col gap-2.5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h2 id="call-h" className="m-0 text-[clamp(28px,3vw,38px)] font-bold leading-[1.08] tracking-[-0.03em]">
                {variant.title}
              </h2>
              <p className="fx-text2 m-0 max-w-[62ch] text-base leading-normal">{variant.session}</p>
              <p className="m-0 text-sm font-semibold">{variant.cap}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <aside aria-label="What Garmin says" className="fx-inset flex max-w-[340px] flex-[1_1_240px] flex-col gap-2 rounded-[22px] px-[18px] py-4">
          <div className="flex items-center justify-between gap-2">
            <p className="fx-label">Garmin says</p>
            <span className={cn("fx-tag", variant.garminTag === "Agrees" ? "fx-tag-good" : "fx-tag-warn")}>{variant.garminTag}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="fx-num text-[30px] font-bold tracking-[-0.02em]">{garmin.readiness}</span>
            <span className="fx-text2 text-sm">Readiness · {garmin.readinessLabel}</span>
          </div>
          <p className="m-0 text-sm">Suggested: {garmin.suggestion}</p>
          <p className="fx-note">{variant.garminNote}</p>
        </aside>
      </div>

      <div className="flex flex-col gap-2.5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h3 id="ck-h" className="m-0 text-[15px] font-semibold">
            Morning check-in
          </h3>
          <span className="fx-text2 text-[13px]">How do you feel? 1 = rough · 5 = great. It changes today&apos;s plan.</span>
        </div>
        <ToggleGroup
          type="single"
          value={String(checkIn)}
          onValueChange={(v: string) => {
            if (v) onCheckIn(Number(v));
          }}
          aria-labelledby="ck-h"
          className="fx-ck-group flex max-w-[520px]"
        >
          {[1, 2, 3, 4, 5].map((n) => (
            <ToggleGroupItem key={n} value={String(n)} aria-label={`Feeling ${n} out of 5`} className="fx-ck">
              {n}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-2.5">
        {reasons.map((r) => (
          <div key={r.label} className="fx-inset flex flex-col gap-1 rounded-[18px] px-4 py-3.5">
            <div className="fx-text2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.06em]">
              <span className={cn("fx-sdot", `fx-sdot-${r.tone}`)} aria-hidden="true" />
              {r.label}
            </div>
            <div className="text-base font-semibold">{r.value}</div>
            <div className="fx-text2 text-[13px]">{r.detail}</div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}
