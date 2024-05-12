import clsx from "clsx";
import {
  type LinksFunction,
  type LoaderFunction,
  type MetaFunction,
  json,
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import type { Theme } from "~/utils/theme-provider";
import {
  ThemeBody,
  ThemeHead,
  ThemeProvider,
  useTheme,
} from "~/utils/theme-provider";
import tailwindStylesheetUrl from "./styles/tailwind-styles.css";
import cssVariablesStylesheetUrl from "./styles/variables.css";
import globalStylesheetUrl from "./styles/global.css";
import codeLightTheme from "./styles/light-theme.css";
import codeDarkTheme from "./styles/dark-theme.css";
import { getUser } from "./session.server";
import { getThemeSession } from "./utils/theme.server";
import { Analytics } from "@vercel/analytics/react";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: cssVariablesStylesheetUrl },
    { rel: "stylesheet", href: globalStylesheetUrl },
    {
      rel: "stylesheet",
      href: "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/atom-one-dark.min.css",
    },
    {
      rel: "stylesheet",
      href: "https://unpkg.com/@highlightjs/cdn-assets@11.9.0/styles/atom-one-light.min.css",
    },
  ];
};

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Remix Notes",
  viewport: "width=device-width,initial-scale=1",
});

type LoaderData = {
  user: Awaited<ReturnType<typeof getUser>>;
  theme: Theme | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  return json<LoaderData>({
    user: await getUser(request),
    theme: themeSession.getTheme(),
  });
};

function App() {
  const [theme] = useTheme();
  const data = useLoaderData<LoaderData>();
  const codeTheme = theme === "dark" ? codeDarkTheme : codeLightTheme;
  return (
    <html lang="en" className={clsx("h-full", theme)}>
      <head>
        <Meta />
        <Links />
        <ThemeHead ssrTheme={Boolean(data.theme)} />
        <link rel="stylesheet" href={codeTheme} />
        <script
          crossorigin
          src="https://unpkg.com/@highlightjs/cdn-assets@11.9.0/highlight.min.js"
        ></script>
      </head>
      <body className="min-h-full">
        <Outlet />
        <ThemeBody ssrTheme={Boolean(data.theme)} />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
        <Analytics />
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<LoaderData>();
  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}
