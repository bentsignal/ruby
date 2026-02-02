import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start";
import { redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import { env } from "~/env";

export const {
  handler,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthReactStart({
  convexUrl: env.VITE_CONVEX_URL,
  convexSiteUrl: env.VITE_CONVEX_SITE_URL,
});

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken();
});

export async function isAuthenticated() {
  const token = await getToken();
  return !!token;
}

export function redirectIfNotLoggedIn({
  redirectURL,
}: { redirectURL?: string } = {}): never {
  const redirectTo = redirectURL ?? "/";
  throw redirect({ to: "/", search: { showLogin: "true", redirectTo } });
}
