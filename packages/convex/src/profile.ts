import { v } from "convex/values";

import { query } from "./_generated/server";
import { authedQuery } from "./utils";

export const getProfile = query({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.profileId);
  },
});

export const getMyProfile = authedQuery({
  handler: async (ctx) => {
    return await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user.subject))
      .first();
  },
});
