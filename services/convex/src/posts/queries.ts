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
      .order("asc")
      .collect();

    return await getUIPosts(ctx, posts);
  },
});

export const getByUsernamePaginated = authedQuery({
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
      page: await getUIPosts(ctx, posts.page),
    };
  },
});

export const getFriendsFeedPaginated = authedQuery({
  args: {
    order: postOrderValidator,
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const friendshipsByA = await ctx.db
      .query("friends")
      .withIndex("by_profileA", (q) => q.eq("profileIdA", ctx.myProfile._id))
      .filter((q) => q.eq(q.field("status"), "friends"))
      .collect();
    const friendshipsByB = await ctx.db
      .query("friends")
      .withIndex("by_profileB", (q) => q.eq("profileIdB", ctx.myProfile._id))
      .filter((q) => q.eq(q.field("status"), "friends"))
      .collect();

    const friendProfileIds = Array.from(
      new Set([
        ...friendshipsByA.map((friendship) => friendship.profileIdB),
        ...friendshipsByB.map((friendship) => friendship.profileIdA),
      ]),
    );
    const [firstFriendProfileId, ...otherFriendProfileIds] = friendProfileIds;
    if (!firstFriendProfileId) {
      return { page: [], isDone: true, continueCursor: "" };
    }

    const posts = await ctx.db
      .query("posts")
      .order(getConvexOrder(args.order))
      .filter((q) =>
        q.or(
          q.eq(q.field("profileId"), firstFriendProfileId),
          ...otherFriendProfileIds.map((profileId) =>
            q.eq(q.field("profileId"), profileId),
          ),
        ),
      )
      .paginate(args.paginationOpts);

    return {
      ...posts,
      page: await getUIPosts(ctx, posts.page),
    };
  },
});

function getConvexOrder(order: "oldest first" | "newest first") {
  return order === "oldest first" ? "asc" : "desc";
}
