import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

const runtimeEnv = import.meta.env.SSR
  ? ((
      globalThis as unknown as {
        process?: { env?: Record<string, string | undefined> };
      }
    ).process?.env ?? {})
  : import.meta.env;

export const env = createEnv({
  clientPrefix: "VITE_",
  server: {
    SENTRY_AUTH_TOKEN: z.string(),
  },
  client: {
    VITE_NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("production"),
    VITE_CONVEX_URL: z.url(),
    VITE_CONVEX_SITE_URL: z.url(),
    VITE_SITE_URL: z.url(),
    VITE_SENTRY_DSN: z.url(),
  },
  runtimeEnv,
  emptyStringAsUndefined: true,
});
