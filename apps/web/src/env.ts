import { createEnv } from "@t3-oss/env-core";
import { z } from "zod/v4";

export const env = createEnv({
  clientPrefix: "VITE_",
  client: {
    VITE_NODE_ENV: z
      .enum(["development", "production", "test"])
      .default("development"),
    VITE_CONVEX_URL: z.string().url(),
    VITE_CONVEX_SITE_URL: z.string().url(),
    VITE_SITE_URL: z.string().url(),
  },
  runtimeEnv: import.meta.env,
  emptyStringAsUndefined: true,
});
