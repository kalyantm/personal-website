import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Button } from "~/components/ui/button";
import { RACE } from "~/lib/fitness/race";
import type { DashboardData } from "~/lib/fitness/types";
import { GlassCard, Segmented } from "./ui/primitives";
import { FuelInfo } from "./section-info";

type Load = "light" | "mod" | "high" | "vhigh";

const LOADS: { value: Load; label: string; gPerKg: [number, number]; note: string; during: string }[] = [
  { value: "light", label: "Light", gPerKg: [3, 5], note: "Under 1 h, easy", during: "Under about 75 minutes, water is enough." },
  { value: "mod", label: "Moderate", gPerKg: [5, 7], note: "About 1 h of training", during: "Under about 75 minutes, water is enough. Going longer: 30–60 g carbs per hour." },
  { value: "high", label: "High", gPerKg: [6, 10], note: "1–3 h of training", during: "1–2.5 hours: 30–60 g carbs per hour, plus fluid to thirst." },
  { value: "vhigh", label: "Very high", gPerKg: [8, 12], note: "4 h+ of training", during: "2.5 hours+: up to 90 g carbs per hour from glucose + fructose. A trained gut can go higher." },
];

const PROTEIN_G_PER_KG = 1.8;

const loadForMinutes = (min: number): Load => (min < 45 ? "light" : min < 90 ? "mod" : min < 210 ? "high" : "vhigh");

const fmtDay = (iso: string, offset = 0) => {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + offset);
  return new Intl.DateTimeFormat("en-GB", { timeZone: "UTC", weekday: "short", day: "numeric", month: "short" }).format(d);
};

export function FuelToday({ fuel, daysToRace }: { fuel: DashboardData["fuel"]; daysToRace: number }) {
  const { weightKg, eaten } = fuel;
  const minutes = fuel.trainingMinutesToday ?? 0;
  const [load, setLoad] = useState<Load>(() => loadForMinutes(minutes));
  const [preview, setPreview] = useState(false);
  const l = LOADS.find((x) => x.value === load)!;
  const carbLo = Math.round(weightKg * l.gPerKg[0]);
  const carbHi = Math.round(weightKg * l.gPerKg[1]);
  const protein = Math.round(weightKg * PROTEIN_G_PER_KG);
  const showEaten = preview && eaten;
  const carbsLeft = eaten ? Math.max(0, carbLo - eaten.carbs) : 0;
  const proteinLeft = eaten ? Math.max(0, protein - eaten.protein) : 0;

  return (
    <GlassCard labelledBy="fuel-h" delay={0.24} className="flex min-w-0 flex-col gap-[18px] rounded-[28px] p-6">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="fuel-h" className="fx-card-h flex items-center gap-2">
          Fuel today
          <FuelInfo />
        </h2>
        <span className="fx-num fx-text2 text-[13px]">
          at {weightKg} kg{fuel.weightSource ? ` · ${fuel.weightSource}` : ""}
        </span>
      </div>

      <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-x-8 gap-y-[18px]">
        <div className="flex min-w-0 flex-col gap-[18px]">
          <div className="flex flex-col gap-2">
            <Segmented label="Training load today" value={load} onChange={setLoad} options={LOADS} className="self-start" />
            <span className="fx-text3 text-xs">
              {minutes > 0 ? `Preselected from today’s ${minutes} min of training on Garmin.` : "No training recorded today yet, so it starts at Light."}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <div className="fx-inset flex flex-col gap-1 rounded-[18px] px-4 py-3.5">
              <span className="fx-text2 text-xs">
                Carbs · {l.gPerKg[0]}–{l.gPerKg[1]} g/kg
              </span>
              <span className="fx-num whitespace-nowrap text-[clamp(19px,5.6vw,24px)] font-bold tracking-[-0.02em]">
                {carbLo}–{carbHi} g
              </span>
              <span className="fx-text2 text-xs">{l.note}</span>
            </div>
            <div className="fx-inset flex flex-col gap-1 rounded-[18px] px-4 py-3.5">
              <span className="fx-text2 text-xs">Protein · {PROTEIN_G_PER_KG} g/kg</span>
              <span className="fx-num whitespace-nowrap text-[clamp(19px,5.6vw,24px)] font-bold tracking-[-0.02em]">{protein} g</span>
              <span className="fx-num fx-text2 text-xs">4 feeds of ~{Math.round(protein / 4)} g</span>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <p className="fx-label">During the session</p>
            <p className="m-0 text-sm leading-[1.45]">{l.during}</p>
          </div>
        </div>

        <div className="flex min-w-0 flex-col gap-[18px]">
          <div className="fx-inset flex flex-col gap-3 rounded-[18px] p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="fx-label">Eaten so far</p>
              {eaten && (
                <Button type="button" className="fx-btn fx-btn-ghost fx-btn-sm" aria-pressed={preview} onClick={() => setPreview((p) => !p)}>
                  {preview ? "Hide preview" : "Preview with Cal AI"}
                </Button>
              )}
            </div>
            <AnimatePresence exitBeforeEnter initial={false}>
              {showEaten ? (
                <motion.div key="eaten" className="flex flex-col gap-3" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>
                  <Meter
                    label="Carbs"
                    value={`${eaten.carbs} g of ${carbLo}–${carbHi}`}
                    fill={Math.min(100, (eaten.carbs / carbHi) * 100)}
                    marker={(carbLo / carbHi) * 100}
                    colorClass="fx-bg-run"
                    aria={`Carbs eaten ${eaten.carbs} g, target ${carbLo} to ${carbHi} g`}
                  />
                  <Meter
                    label="Protein"
                    value={`${eaten.protein} g of ${protein}`}
                    fill={Math.min(100, (eaten.protein / protein) * 100)}
                    colorClass="fx-bg-gym"
                    aria={`Protein eaten ${eaten.protein} g of ${protein} g`}
                  />
                  <p className="m-0 text-sm leading-[1.45]">
                    {carbsLeft || proteinLeft ? `Still to go today: about ${carbsLeft} g carbs and ${proteinLeft} g protein.` : "You’ve hit today’s targets."}
                  </p>
                </motion.div>
              ) : (
                <motion.p key="hint" className="fx-note" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  Not connected yet. In phase 2, meals logged in Cal AI flow in through Apple Health, and the targets above turn into “eat this much more today”.
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          {daysToRace >= 0 && <RaceFuelNote weightKg={weightKg} />}
        </div>
      </div>
    </GlassCard>
  );
}

function RaceFuelNote({ weightKg }: { weightKg: number }) {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="fx-label">
        {RACE.name} · {fmtDay(RACE.date)}
      </p>
      <p className="m-0 text-sm leading-[1.45]">
        Carbs at 7–10 g/kg on {fmtDay(RACE.date, -1)} ({Math.round(weightKg * 7)}–{Math.round(weightKg * 10)} g), then 1–4 g/kg in the 1–4 hours before your
        wave. Under-fuelling raises bone-stress risk, so don&apos;t diet into a build.
      </p>
    </div>
  );
}

function Meter({
  label,
  value,
  fill,
  marker,
  colorClass,
  aria,
}: {
  label: string;
  value: string;
  fill: number;
  marker?: number;
  colorClass: string;
  aria: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex justify-between text-[13px]">
        <span>{label}</span>
        <span className="fx-num fx-text2">{value}</span>
      </div>
      <div className="fx-mbar" role="img" aria-label={aria}>
        <motion.div className={`fx-mfill ${colorClass}`} initial={{ width: 0 }} animate={{ width: `${fill}%` }} transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }} />
        {marker !== undefined && <div className="fx-mmark" style={{ left: `${marker}%` }} />}
      </div>
    </div>
  );
}
