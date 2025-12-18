import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

export const getAll = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("posts").order("desc").collect();
  },
});

export const create = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("posts", args);
  },
});

export const getById = query({
  args: {
    id: v.id("posts"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get("posts", args.id);
  },
});
