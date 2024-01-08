import type { ActionFunction } from "@remix-run/react";

const CONVERTKIT_API_SECRET = "GMao5aQ9TwdU9vTsPhPFSQ";
const FORM_ID = "3307413";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const email = formData.get("email");
  const name = formData.get("name");

  const subscriptionRes = await fetch(
    `https://api.convertkit.com/v3/forms/${FORM_ID}/subscribe`,
    {
      method: "POST",
      body: JSON.stringify({ email, name, api_key: CONVERTKIT_API_SECRET }),
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );

  return subscriptionRes.json();
};
