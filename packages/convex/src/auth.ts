import type { AuthFunctions, GenericCtx } from "@convex-dev/better-auth";
import { expo } from "@better-auth/expo";
import { createClient } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { betterAuth } from "better-auth/minimal";

import type { DataModel } from "./_generated/dataModel";
import { components, internal } from "./_generated/api";
import { primaryAuthConfig } from "./auth.config";
import { env } from "./convex.env";
import { urls } from "./urls";

const authFunctions: AuthFunctions = internal.auth;
const trustedOrigins =
  env.ENVIRONMENT === "production"
    ? [urls.web, "ruby://"]
    : [
        urls.web,
        "https://*.ruby.localhost",
        "https://*.www.ruby.localhost",
        "ruby://",
      ];
export const authCorsAllowedOrigins =
  env.ENVIRONMENT === "production"
    ? []
    : ["*.ruby.localhost", "*.www.ruby.localhost"];

export const authComponent = createClient<DataModel>(components.betterAuth, {
  authFunctions,
  triggers: {},
});

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: urls.convex.site,
    trustedOrigins,
    database: authComponent.adapter(ctx),
    socialProviders: {
      google: {
        prompt: "select_account",
        clientId: env.GOOGLE_CLIENT_ID,
        clientSecret: env.GOOGLE_CLIENT_SECRET,
      },
    },
    plugins: [
      expo(),
      crossDomain({ siteUrl: urls.web }),
      convex({ authConfig: primaryAuthConfig }),
    ],
  });
};

export const { onCreate, onUpdate, onDelete } = authComponent.triggersApi();
