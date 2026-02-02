import { redirect } from "next/navigation";
import { convexBetterAuthNextJs } from "@convex-dev/better-auth/nextjs";

import { env } from "~/env";

export const {
  handler,
  preloadAuthQuery,
  isAuthenticated,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthNextJs({
  convexUrl: env.NEXT_PUBLIC_CONVEX_URL,
  convexSiteUrl: env.NEXT_PUBLIC_CONVEX_SITE_URL,
});

export async function redirectIfNotLoggedIn({
  redirectURL,
}: { redirectURL?: string } = {}) {
  const isAuthed = await isAuthenticated();
  if (!isAuthed) {
    const redirectTo = encodeURIComponent(redirectURL ?? "/");
    redirect(`/?showLogin=true&redirectTo=${redirectTo}`);
  }
}
