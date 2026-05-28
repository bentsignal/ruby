import type { AuthConfig } from "convex/server";
import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";

import { env } from "./convex.env";

const usesOwnAuthProvider =
  env.ENVIRONMENT === "production" ||
  env.CONVEX_CLOUD_URL === "https://api.dev.ruby.travel";
const trustsSharedDevelopmentAuth =
  env.ENVIRONMENT === "development" && !usesOwnAuthProvider;

const sharedDevelopmentAuthProviders =
  process.env.SHARED_AUTH_JWT_ISSUER && process.env.SHARED_AUTH_JWT_JWKS
    ? ([
        {
          type: "customJwt",
          issuer: process.env.SHARED_AUTH_JWT_ISSUER,
          applicationID: "convex",
          algorithm: "RS256",
          jwks: process.env.SHARED_AUTH_JWT_JWKS,
        },
      ] satisfies AuthConfig["providers"])
    : [];

// Used by BetterAuth's convex() plugin — only the primary provider
export const primaryAuthConfig = {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;

// Used by Convex's auth system — includes worktree trust for non-main deployments
export default {
  providers: [
    getAuthConfigProvider(),
    ...(trustsSharedDevelopmentAuth ? sharedDevelopmentAuthProviders : []),
  ],
} satisfies AuthConfig;
