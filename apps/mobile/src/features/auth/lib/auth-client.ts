import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { urls } from "~/utils/urls";

const scheme = Constants.expoConfig?.scheme;
if (scheme === undefined || scheme.length === 0) {
  throw new Error("Missing Expo scheme");
}
const expoScheme = Array.isArray(scheme) ? scheme[0] : scheme;
if (expoScheme === undefined || expoScheme.length === 0) {
  throw new Error("Missing Expo scheme");
}

export const authClient = createAuthClient({
  baseURL: urls.web,
  plugins: [
    expoClient({
      scheme: expoScheme,
      storagePrefix: expoScheme,
      storage: SecureStore,
    }),
    convexClient(),
  ],
});
