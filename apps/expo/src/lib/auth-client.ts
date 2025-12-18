import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { env } from "~/expo.env";

export const authClient = createAuthClient({
  baseURL: env.EXPO_PUBLIC_CONVEX_SITE_URL,
  plugins: [
    expoClient({
      scheme: Constants.expoConfig?.scheme as string,
      storagePrefix: Constants.expoConfig?.scheme as string,
      storage: SecureStore,
    }),
    convexClient(),
  ],
});
