import { ConvexError, v } from "convex/values";

import { rateLimiter } from "../limiter";
import { authedMutation } from "../utils";

export const like = authedMutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { ok, retryAfter } = await rateLimiter.limit(ctx, "likePost", {
      key: ctx.myProfile._id,
    });
    if (!ok) {
      throw new ConvexError(
        "Rate limit exceeded, retry after " + retryAfter + " seconds",
      );
    }

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_profile_post", (q) =>
        q.eq("profileId", ctx.myProfile._id).eq("postId", args.postId),
      )
      .first();
    if (existing) return;

    await ctx.db.insert("likes", {
      postId: args.postId,
      profileId: ctx.myProfile._id,
    });
  },
});

export const unlike = authedMutation({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, args) => {
    const { ok, retryAfter } = await rateLimiter.limit(ctx, "likePost", {
      key: ctx.myProfile._id,
    });
    if (!ok) {
      throw new ConvexError(
        "Rate limit exceeded, retry after " + retryAfter + " seconds",
      );
    }

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_profile_post", (q) =>
        q.eq("profileId", ctx.myProfile._id).eq("postId", args.postId),
      )
      .first();
    if (!existing) return;

    await ctx.db.delete("likes", existing._id);
  },
});
