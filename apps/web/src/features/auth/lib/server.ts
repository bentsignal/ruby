import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";

import { urls } from "~/urls";

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
