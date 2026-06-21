import { ConvexError } from "convex/values";

import type { Doc, Id } from "../_generated/dataModel";
import type { AuthedMutationCtx, AuthedQueryCtx } from "../utils";
import type { Relationship } from "./types";

export function getOrderedProfileIds(
  profileOne: Id<"profiles">,
  profileTwo: Id<"profiles">,
) {
  if (profileOne < profileTwo) {
    return { profileIdA: profileOne, profileIdB: profileTwo };
  }
  return { profileIdA: profileTwo, profileIdB: profileOne };
}

export async function getFriendProfileIds(
  ctx: AuthedMutationCtx | AuthedQueryCtx,
  profileId: Id<"profiles">,
) {
  const friendshipsByA = await ctx.db
    .query("friends")
    .withIndex("by_profileA", (q) => q.eq("profileIdA", profileId))
    .filter((q) => q.eq(q.field("status"), "friends"))
    .collect();
  const friendshipsByB = await ctx.db
    .query("friends")
    .withIndex("by_profileB", (q) => q.eq("profileIdB", profileId))
    .filter((q) => q.eq(q.field("status"), "friends"))
    .collect();

  return Array.from(
    new Set([
      ...friendshipsByA.map((friendship) => friendship.profileIdB),
      ...friendshipsByB.map((friendship) => friendship.profileIdA),
    ]),
  );
}

async function getFriendshipStatusHelper(
  ctx: AuthedMutationCtx | AuthedQueryCtx,
  profileOne: Id<"profiles">,
  profileTwo: Id<"profiles">,
) {
  // TODO: This line shouldn't be neccessary but it does seem to be fixing a bug.
  // Look closer once convex isn't broken lol
  if (!profileOne || !profileTwo) return null;
  const { profileIdA, profileIdB } = getOrderedProfileIds(
    profileOne,
    profileTwo,
  );
  if (profileIdA === profileIdB)
    throw new ConvexError("Cannot get friendship status to yourself");
  return await ctx.db
    .query("friends")
    .withIndex("by_profileA", (q) => q.eq("profileIdA", profileIdA))
    .filter((q) => q.eq(q.field("profileIdB"), profileIdB))
    .first();
}

// eslint-disable-next-line no-restricted-syntax -- This helper defines a public Convex query union contract.
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
