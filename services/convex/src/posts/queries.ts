import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import { authedQuery } from "../utils";
import { getUIPosts } from "./read";

const postOrderValidator = v.union(
  v.literal("oldest first"),
  v.literal("newest first"),
);

export const getByUsername = authedQuery({
  args: {
    username: v.string(),
    order: postOrderValidator,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_profileId", (q) => q.eq("profileId", profile._id))
      .order(getConvexOrder(args.order))
      .paginate(args.paginationOpts);

    return {
      ...posts,
      page: await getUIPosts(ctx, posts.page, {
        profilesById: new Map([[profile._id, profile]]),
      }),
    };
  },
});

export const getFeed = authedQuery({
  args: {
    order: postOrderValidator,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const feedItems = await ctx.db
      .query("feedItems")
      .withIndex("by_profileId", (q) => q.eq("profileId", ctx.myProfile._id))
      .order(getConvexOrder(args.order))
      .paginate(args.paginationOpts);
    const postResults = await Promise.all(
      feedItems.page.map(async (feedItem) => {
        return await ctx.db.get(feedItem.postId);
      }),
    );
    const posts = postResults.filter((post) => post !== null);

    return {
      ...feedItems,
      page: await getUIPosts(ctx, posts),
    };
  },
});

function getConvexOrder(order: "oldest first" | "newest first") {
  return order === "oldest first" ? "asc" : "desc";
}
