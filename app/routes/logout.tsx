import type { ActionFunction, LoaderFunction } from "@remix-run/react";
import { redirect } from "@remix-run/react";
import { logout } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  return logout(request);
};

export const loader: LoaderFunction = async () => {
  return redirect("/");
};
