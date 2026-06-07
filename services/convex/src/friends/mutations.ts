import { ConvexError, v } from "convex/values";

import { rateLimiter } from "../limiter";
import { authedMutation } from "../utils";
import { getOrderedProfileIds, getRelationshipHelper } from "./helpers";

export const sendRequest = authedMutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const { ok, retryAfter } = await rateLimiter.limit(
      ctx,
      "updateFriendStatus",
      { key: ctx.myProfile._id },
    );
    if (!ok) {
      throw new ConvexError(
        "Rate limit exceeded, retry after " + retryAfter + " seconds",
      );
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) throw new ConvexError("Profile not found");
    const { relationship, friendship } = await getRelationshipHelper({
      ctx,
      profileRequestingInfo: ctx.myProfile._id,
      otherProfile: profile._id,
    });
    if (relationship === "my-profile") {
      throw new ConvexError("Cannot send friend request to yourself");
    }
    if (relationship === "friends") {
      throw new ConvexError("Already friends");
    }
    if (relationship === "pending-outgoing") {
      throw new ConvexError("Friend request already sent");
    }
    const { profileIdA, profileIdB } = getOrderedProfileIds(
      ctx.myProfile._id,
      profile._id,
    );
    if (relationship === "pending-incoming" && friendship !== null) {
      await ctx.db.patch("friends", friendship._id, {
        status: "friends",
      });
      return;
    }
    await ctx.db.insert("friends", {
      profileIdA,
      profileIdB,
      status: "pending",
      initiatedBy: ctx.myProfile._id,
    });
  },
});

export const acceptRequest = authedMutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) throw new ConvexError("Profile not found");
    const { relationship, friendship } = await getRelationshipHelper({
      ctx,
      profileRequestingInfo: ctx.myProfile._id,
      otherProfile: profile._id,
    });
    if (relationship !== "pending-incoming") {
      throw new ConvexError("Not a pending incoming friend request");
    }
    if (friendship === null) {
      throw new ConvexError("Friend request not found");
    }
    await ctx.db.patch("friends", friendship._id, {
      status: "friends",
    });
  },
});

export const ignoreRequest = authedMutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) throw new ConvexError("Profile not found");
    const { relationship, friendship } = await getRelationshipHelper({
      ctx,
      profileRequestingInfo: ctx.myProfile._id,
      otherProfile: profile._id,
    });
    if (relationship !== "pending-incoming") {
      throw new ConvexError("Not a pending incoming friend request");
    }
    if (friendship === null) {
      throw new ConvexError("Friend request not found");
    }
    await ctx.db.delete("friends", friendship._id);
  },
});

export const cancelRequest = authedMutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) throw new ConvexError("Profile not found");
    const { relationship, friendship } = await getRelationshipHelper({
      ctx,
      profileRequestingInfo: ctx.myProfile._id,
      otherProfile: profile._id,
    });
    if (relationship !== "pending-outgoing") {
      throw new ConvexError("Not a pending outgoing friend request");
    }
    if (friendship === null) {
      throw new ConvexError("Friend request not found");
    }
    await ctx.db.delete("friends", friendship._id);
  },
});

export const remove = authedMutation({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const { ok, retryAfter } = await rateLimiter.limit(
      ctx,
      "updateFriendStatus",
      { key: ctx.myProfile._id },
    );
    if (!ok) {
      throw new ConvexError(
        "Rate limit exceeded, retry after " + retryAfter + " seconds",
      );
    }
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) throw new ConvexError("Profile not found");
    const { relationship, friendship } = await getRelationshipHelper({
      ctx,
      profileRequestingInfo: ctx.myProfile._id,
      otherProfile: profile._id,
    });
    if (relationship !== "friends") {
      throw new ConvexError("Not friends");
    }
    if (friendship === null) {
      throw new ConvexError("Friendship not found");
    }
    await ctx.db.delete("friends", friendship._id);
  },
});
