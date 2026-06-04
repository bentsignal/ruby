import { createEnv } from "convex-env";
import {
  betterAuth,
  environment,
  oAuth,
  uploadthing,
} from "convex-env/presets";
import { v } from "convex/values";

export const env = createEnv({
  BUNNY_STORAGE_ACCESS_KEY: v.optional(v.string()),
  BUNNY_STORAGE_HOSTNAME: v.optional(v.string()),
  BUNNY_STORAGE_PUBLIC_URL: v.optional(v.string()),
  BUNNY_STORAGE_ZONE_NAME: v.optional(v.string()),
  ...environment,
  ...betterAuth,
  ...oAuth.google,
  ...uploadthing,
});
