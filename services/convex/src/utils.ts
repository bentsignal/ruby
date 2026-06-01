import type { CustomCtx } from "convex-helpers/server/customFunctions";
import {
  customCtx,
  customMutation,
  customQuery,
} from "convex-helpers/server/customFunctions";
import { ConvexError } from "convex/values";

import type { MutationCtx, QueryCtx } from "./_generated/server";
import { mutation, query } from "./_generated/server";

export async function checkAuth(ctx: QueryCtx | MutationCtx) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new ConvexError("Unauthenticated");
  }
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

type AuthedQueryCtx = CustomCtx<typeof authedQuery>;
type AuthedMutationCtx = CustomCtx<typeof authedMutation>;

export type { AuthedQueryCtx, AuthedMutationCtx };
