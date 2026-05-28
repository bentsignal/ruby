import { createServerFn } from "@tanstack/react-start";
import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";

import { api } from "@acme/convex/api";

import { urls } from "~/urls";

export async function verifyOneTimeToken(token: string) {
  return await fetch(
    `${urls.convex.site}/api/auth/cross-domain/one-time-token/verify`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "content-type": "application/json",
      },
      body: JSON.stringify({ token }),
    },
  );
}

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken();
});

export const ensureProfileExists = createServerFn({
  method: "GET",
}).handler(async () => {
  return await fetchAuthMutation(api.profile.ensureProfileExists, {});
});
export const {
  handler,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthReactStart({
  convexUrl: urls.convex.cloud,
  convexSiteUrl: urls.convex.site,
});
