import type { GenericCtx } from "@convex-dev/better-auth";
// import type { BetterAuthOptions } from "better-auth";
import { expo } from "@better-auth/expo";
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth";

import type { DataModel } from "./_generated/dataModel";
import { components } from "./_generated/api";
import { query } from "./_generated/server";
import authConfig from "./auth.config";
import { env } from "./convex.env";

// The component client has methods needed for integrating Convex with Better Auth,
// as well as helper methods for general use.
export const authComponent = createClient<DataModel>(components.betterAuth);

const devOrigins = ["expo://*/*", "http://localhost:3000"];

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    trustedOrigins: [
      env.SITE_URL,
      "ruby://",
      "https://*.ruby.travel",
      ...(process.env.NODE_ENV === "development" ? devOrigins : []),
    ],
    baseURL: env.SITE_URL,
    database: authComponent.adapter(ctx),
    // Configure simple, non-verified email/password to get started
    emailAndPassword: {
      enabled: true,
    },
    plugins: [
      // The Expo and Convex plugins are required
      expo(),
      convex({ authConfig }),
    ],
  });
};
// Example function for getting the current user
// Feel free to edit, omit, etc.
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
