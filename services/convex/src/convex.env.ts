import { createEnv } from "convex-env";
import {
  betterAuth,
  environment,
  oAuth,
  uploadthing,
} from "convex-env/presets";

export const env = createEnv({
  ...environment,
  ...betterAuth,
  ...oAuth.google,
  ...uploadthing,
});
