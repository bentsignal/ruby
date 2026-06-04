import { createEnv } from "convex-env";
import { v } from "convex/values";

const schema = {
  BUNNY_STORAGE_ACCESS_KEY: v.string(),
  BUNNY_STORAGE_HOSTNAME: v.string(),
  BUNNY_STORAGE_PUBLIC_URL: v.string(),
  BUNNY_STORAGE_ZONE_NAME: v.string(),
};

export const storageEnv = createEnv({
  schema,
  options: {
    skipValidation: true,
  },
});
