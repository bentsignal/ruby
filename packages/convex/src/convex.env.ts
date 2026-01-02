import { createEnv } from "convex-env";
import { v } from "convex/values";

export const env = createEnv({
  ENVIRONMENT: v.union(v.literal("development"), v.literal("production")),
  SITE_URL: v.string(),
  BETTER_AUTH_SECRET: v.string(),
  GOOGLE_CLIENT_ID: v.string(),
  GOOGLE_CLIENT_SECRET: v.string(),
});
