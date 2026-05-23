import type { AuthConfig } from "convex/server";
import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";

import { env } from "./convex.env";

const isMainDeployment =
  env.ENVIRONMENT === "production" ||
  env.CONVEX_CLOUD_URL === "https://api.dev.ruby.travel";

// Used by BetterAuth's convex() plugin — only the primary provider
export const primaryAuthConfig = {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;

// Used by Convex's auth system — includes worktree trust for non-main deployments
export default {
  providers: [
    getAuthConfigProvider(),
    ...(isMainDeployment
      ? []
      : [
          {
            domain: "https://site.dev.ruby.travel",
            applicationID: "convex",
          },
        ]),
  ],
} satisfies AuthConfig;
