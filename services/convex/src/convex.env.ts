import { createEnv } from "convex-env";
import { betterAuth, environment, oAuth } from "convex-env/presets";
import { v } from "convex/values";

export const env = createEnv({
  BUNNY_STORAGE_ACCESS_KEY: v.string(),
  BUNNY_STORAGE_HOSTNAME: v.string(),
  BUNNY_STORAGE_PUBLIC_URL: v.string(),
  BUNNY_STORAGE_ZONE_NAME: v.string(),
  ...environment,
  ...betterAuth,
  ...oAuth.google,
});
