import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { ConvexError } from "convex/values";

import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

export const checkAuth = async (ctx: QueryCtx | MutationCtx | ActionCtx) => {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new ConvexError("Unauthenticated");
  }
  return user;
};

export const authedMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const user = await checkAuth(ctx);
    return { user };
  }),
);

export const authedQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const user = await checkAuth(ctx);
    return { user };
  }),
);
