import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "~/expo.env";

const scheme = Constants.expoConfig?.scheme;
if (scheme === undefined || scheme.length === 0) {
  throw new Error("Missing Expo scheme");
}

export const authClient = createAuthClient({
  baseURL: env("CONVEX_SITE_URL"),
  plugins: [
    expoClient({
      scheme: scheme as string,
      storagePrefix: scheme as string,
      storage: SecureStore,
    }),
    convexClient(),
  ],
});
