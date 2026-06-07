import { v } from "convex/values";

import { authedQuery } from "../utils";
import { getUIPosts } from "./read";

export const getAll = authedQuery({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return await getUIPosts(ctx, posts);
  },
});

export const getByUsername = authedQuery({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) return [];

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_profileId", (q) => q.eq("profileId", profile._id))
      .order("desc")
      .collect();

    return await getUIPosts(ctx, posts);
  },
});
