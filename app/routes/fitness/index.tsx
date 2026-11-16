import { json, type LinksFunction, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { FitnessDashboard } from "~/components/fitness/fitness-dashboard";
import { PasswordGate } from "~/components/fitness/password-gate";
import type { DashboardData } from "~/lib/fitness/types";
import { getDashboard } from "~/lib/garmin/dashboard.server";
import { useTheme } from "~/utils/theme-provider";
import fitnessStylesheetUrl from "~/styles/fitness.css";

export const links: LinksFunction = () => [{ rel: "stylesheet", href: fitnessStylesheetUrl }];

export const meta: MetaFunction = () => ({
  title: "Fitness · thisisktm",
  // Health data: keep it out of search engines (and behind auth once it's real).
  robots: "noindex, nofollow",
});

export const loader: LoaderFunction = async () => {
  // Fresh Garmin data (rate-limit aware, see dashboard.server.ts). The password gate is client-side only.
  const data = await getDashboard();
  return json<DashboardData>(data, { headers: { "Cache-Control": "private, no-store" } });
};

export default function FitnessPage() {
  const data = useLoaderData<DashboardData>();
  const [theme] = useTheme();
  const mode = theme === "light" ? "light" : "dark";
  return (
    <PasswordGate themeClass={mode === "light" ? "fx-light" : "fx-dark"}>
      <FitnessDashboard data={data} theme={mode} />
    </PasswordGate>
  );
}
