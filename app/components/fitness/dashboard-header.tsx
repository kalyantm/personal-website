import { useRevalidator } from "@remix-run/react";

export function DashboardHeader({
  dateLabel,
  race,
  daysToRace,
  syncedAt,
  watchSyncedAt,
  source = "garmin",
  syncStatus,
}: {
  dateLabel: string;
  race: string;
  daysToRace: number;
  syncedAt: string;
  watchSyncedAt?: string;
  source?: "garmin" | "sample";
  syncStatus?: { state: "fresh" | "stale"; reason?: string };
}) {
  const revalidator = useRevalidator();
  const syncing = revalidator.state === "loading";
  const stale = syncStatus?.state === "stale" || source !== "garmin";
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="m-0 text-[clamp(30px,5.4vw,46px)] font-bold leading-[1.05] tracking-[-0.035em]">{dateLabel}</h1>
      </header>

      <div className="flex flex-wrap gap-2">
        <span className="fx-chip fx-glass">
          <span className="fx-dot fx-bg-run" aria-hidden="true" />
          {daysToRace > 0 ? (
            <>
              {race} in <strong className="font-bold">{daysToRace === 1 ? "1 day" : `${daysToRace} days`}</strong>
            </>
          ) : daysToRace === 0 ? (
            <strong className="font-bold">{race} is today</strong>
          ) : (
            <>{race} done</>
          )}
        </span>
        <button
          type="button"
          className={stale && !syncing ? "fx-chip fx-glass fx-sync fx-warn" : "fx-chip fx-glass fx-text2 fx-sync"}
          onClick={() => revalidator.revalidate()}
          disabled={syncing}
          aria-live="polite"
          title={watchSyncedAt ? `Latest data from your watch: ${watchSyncedAt}. Click to sync again.` : "Click to sync again"}
        >
          <SyncIcon spinning={syncing} />
          {syncing
            ? "Syncing with Garmin…"
            : source !== "garmin"
              ? "Garmin not reachable · sample data"
              : stale
                ? `${syncStatus?.reason ?? "Couldn’t reach Garmin"} · showing ${syncedAt}`
                : `Synced from Garmin ${syncedAt}`}
        </button>
      </div>
    </>
  );
}

function SyncIcon({ spinning = false }: { spinning?: boolean }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={spinning ? "fx-spin shrink-0" : "shrink-0"}
    >
      <path d="M20 12a8 8 0 0 1-13.66 5.66L4 15.3" />
      <path d="M4 12a8 8 0 0 1 13.66-5.66L20 8.7" />
      <path d="M20 4v4.7h-4.7" />
      <path d="M4 20v-4.7h4.7" />
    </svg>
  );
}
