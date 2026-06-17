import type { CustomCtx } from "convex-helpers/server/customFunctions";
import {
  customAction,
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { ConvexError } from "convex/values";

import type { ActionCtx, MutationCtx, QueryCtx } from "./_generated/server";
import { action, mutation, query } from "./_generated/server";

export async function checkIdentity(ctx: QueryCtx | MutationCtx | ActionCtx) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new ConvexError("Unauthenticated");
  }
  return user;
}

export async function checkAuth(ctx: QueryCtx | MutationCtx) {
  const user = await checkIdentity(ctx);
  const myProfile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", user.subject))
    .first();
  if (!myProfile) {
    throw new ConvexError("Profile not found");
  }
  return { user, myProfile };
}

export const authedMutation = customMutation(
  mutation,
  customCtx(async (ctx) => {
    const { user, myProfile } = await checkAuth(ctx);
    return { user, myProfile };
  }),
);

export const authedQuery = customQuery(
  query,
  customCtx(async (ctx) => {
    const { user, myProfile } = await checkAuth(ctx);
    return { user, myProfile };
  }),
);

export const authedAction = customAction(
  action,
  customCtx(async (ctx) => {
    const user = await checkIdentity(ctx);
    return { user };
  }),
);

type AuthedQueryCtx = CustomCtx<typeof authedQuery>;
type AuthedMutationCtx = CustomCtx<typeof authedMutation>;
type AuthedActionCtx = CustomCtx<typeof authedAction>;

export type { AuthedActionCtx, AuthedMutationCtx, AuthedQueryCtx };
