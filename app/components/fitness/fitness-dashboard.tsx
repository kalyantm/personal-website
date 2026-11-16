import { cn } from "~/lib/utils";
import type { DashboardData } from "~/lib/fitness/types";
import { DashboardHeader } from "./dashboard-header";
import { FitnessForm } from "./fitness-form";
import { FuelToday } from "./fuel-today";
import { ProgressMarkers } from "./progress-markers";
import { Recovery } from "./recovery";
import { RunBuild } from "./run-build";
import { FitnessFormInfo, RunBuildInfo } from "./section-info";
import { ThisWeek } from "./this-week";
import { FxThemeContext } from "./ui/info-tip";

/**
 * Phase 1: present what Garmin knows, in this order:
 * This week → Progress markers → Recovery → Fuel → Run build → Fitness and form.
 * Today's call (todays-call.tsx) and the week planner (week-planner.tsx) return in phase 2.
 */
export function FitnessDashboard({ data, theme = "dark" }: { data: DashboardData; theme?: "dark" | "light" }) {
  const themeClass = theme === "light" ? "fx-light" : "fx-dark";

  // Real running this week from Garmin, against the weekly target.
  const thisWeek = {
    plan: data.week.targets.run.amount,
    done: data.week.activities.filter((a) => a.kind === "run").reduce((a, x) => a + (x.distanceKm ?? 0), 0),
  };

  return (
    <FxThemeContext.Provider value={themeClass}>
      <div className={cn("fx fx-page", themeClass)}>
        <Orbs />
        <main className="relative mx-auto flex max-w-[1280px] flex-col gap-5 px-[clamp(16px,3vw,40px)] pb-16 pt-9">
          <DashboardHeader
            dateLabel={data.todayLabel}
            race={data.block.race}
            daysToRace={data.block.daysToRace}
            syncedAt={data.syncedAt}
            watchSyncedAt={data.watchSyncedAt}
            source={data.source}
            syncStatus={data.syncStatus}
          />

          <ThisWeek week={data.week} />

          <ProgressMarkers markers={data.markers} startDate={data.markersStart} />

          <Recovery metrics={data.recovery} todayISO={data.today} themeClass={themeClass} />

          <FuelToday fuel={data.fuel} daysToRace={data.block.daysToRace} />

          <RunBuild
            run={data.run}
            thisWeek={thisWeek}
            hrv7={data.recoveryContext.hrv7}
            hrvBand={data.recoveryContext.hrvBand}
            info={<RunBuildInfo />}
          />

          <FitnessForm load={data.load} info={<FitnessFormInfo />} />

          <footer className="fx-text3 flex flex-wrap justify-between gap-2 pt-2 text-xs">
            <span>thisisktm.com/fitness</span>
            <span>Data: Garmin Personal API, pulled fresh on every visit</span>
          </footer>
        </main>
      </div>
    </FxThemeContext.Provider>
  );
}

function Orbs() {
  return (
    <>
      <div
        aria-hidden="true"
        className="fx-orb"
        style={{
          top: -180,
          left: -160,
          width: 600,
          height: 600,
          background: "var(--fx-orb1)",
        }}
      />
      <div
        aria-hidden="true"
        className="fx-orb"
        style={{
          top: 700,
          right: -220,
          width: 640,
          height: 640,
          background: "var(--fx-orb2)",
        }}
      />
      <div
        aria-hidden="true"
        className="fx-orb"
        style={{
          top: 1700,
          left: "6%",
          width: 540,
          height: 540,
          background: "var(--fx-orb3)",
        }}
      />
      <div
        aria-hidden="true"
        className="fx-orb"
        style={{
          top: 2800,
          right: "12%",
          width: 500,
          height: 500,
          background: "var(--fx-orb4)",
        }}
      />
    </>
  );
}
