import { ConvexError, v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { Relationship } from "./types";
import type { AuthedMutationCtx, AuthedQueryCtx } from "./utils";
import { authedMutation, authedQuery } from "./utils";

function getOrderedProfileIds(
  profileOne: Id<"profiles">,
  profileTwo: Id<"profiles">,
): [Id<"profiles">, Id<"profiles">] {
  return profileOne < profileTwo
    ? [profileOne, profileTwo]
    : [profileTwo, profileOne];
}

async function getFriendshipStatusHelper(
  ctx: AuthedMutationCtx | AuthedQueryCtx,
  profileOne: Id<"profiles">,
  profileTwo: Id<"profiles">,
) {
  // TODO: This line shouldn't be neccessary but it does seem to be fixing a bug.
  // Look closer once convex isn't broken lol
  if (!profileOne || !profileTwo) return null;
  const [profileIdA, profileIdB] = getOrderedProfileIds(profileOne, profileTwo);
  if (profileIdA === profileIdB)
    throw new ConvexError("Cannot get friendship status to yourself");
  return await ctx.db
    .query("friends")
    .withIndex("by_profileA", (q) => q.eq("profileIdA", profileIdA))
    .filter((q) => q.eq(q.field("profileIdB"), profileIdB))
    .first();
}

export async function getRelationshipHelper({
  ctx,
  profileRequestingInfo,
  otherProfile,
}: {
  ctx: AuthedMutationCtx | AuthedQueryCtx;
  profileRequestingInfo: Id<"profiles">;
  otherProfile: Id<"profiles">;
}): Promise<{ relationship: Relationship; friendship: Doc<"friends"> | null }> {
  if (profileRequestingInfo === otherProfile)
    return { relationship: "my-profile", friendship: null };
  const friendship = await getFriendshipStatusHelper(
    ctx,
    profileRequestingInfo,
    otherProfile,
  );
  if (friendship === null) return { relationship: null, friendship: null };
  if (friendship.status === "friends")
    return { relationship: "friends", friendship };
  if (friendship.initiatedBy === profileRequestingInfo)
    return { relationship: "pending-outgoing", friendship };
  if (friendship.initiatedBy === otherProfile)
    return { relationship: "pending-incoming", friendship };
  return { relationship: null, friendship: null };
}

export const getRelationship = authedQuery({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) throw new ConvexError("Profile not found");
    return await getRelationshipHelper({
      ctx,
      profileRequestingInfo: ctx.myProfile._id,
      otherProfile: profile._id,
    });
  },
});

export const sendRequest = authedMutation({
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
    if (relationship === "my-profile") {
      throw new ConvexError("Cannot send friend request to yourself");
    }
    if (relationship === "friends") {
      throw new ConvexError("Already friends");
    }
    if (relationship === "pending-outgoing") {
      throw new ConvexError("Friend request already sent");
    }
    const [profileIdA, profileIdB] = getOrderedProfileIds(
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
