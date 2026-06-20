import type { PaginationOptions } from "convex/server";
import { paginationOptsValidator } from "convex/server";
import { v } from "convex/values";

import {
  POST_FEED_PAGE_MAXIMUM_BYTES_READ,
  POST_FEED_PAGE_MAXIMUM_ROWS_READ,
  POST_FEED_PAGE_SIZE_MAX,
} from "@acme/config/posts";

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

export const getByUsernamePaginated = authedQuery({
  args: {
    username: v.string(),
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
      .order("desc")
      .paginate(getPostPaginationOpts(args.paginationOpts));

    return {
      ...posts,
      page: await getUIPosts(ctx, posts.page),
    };
  },
});

export const getFriendsFeedPaginated = authedQuery({
  args: {
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
      .order("desc")
      .filter((q) =>
        q.or(
          q.eq(q.field("profileId"), firstFriendProfileId),
          ...otherFriendProfileIds.map((profileId) =>
            q.eq(q.field("profileId"), profileId),
          ),
        ),
      )
      .paginate(getPostPaginationOpts(args.paginationOpts));

    return {
      ...posts,
      page: await getUIPosts(ctx, posts.page),
    };
  },
});

function getPostPaginationOpts(paginationOpts: PaginationOptions) {
  return {
    ...paginationOpts,
    maximumBytesRead: Math.min(
      paginationOpts.maximumBytesRead ?? POST_FEED_PAGE_MAXIMUM_BYTES_READ,
      POST_FEED_PAGE_MAXIMUM_BYTES_READ,
    ),
    maximumRowsRead: Math.min(
      paginationOpts.maximumRowsRead ?? POST_FEED_PAGE_MAXIMUM_ROWS_READ,
      POST_FEED_PAGE_MAXIMUM_ROWS_READ,
    ),
    numItems: Math.min(
      Math.max(1, paginationOpts.numItems),
      POST_FEED_PAGE_SIZE_MAX,
    ),
  };
}
