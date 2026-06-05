import { v } from "convex/values";

export const vFriendshipStatus = v.union(
  v.literal("pending"),
  v.literal("friends"),
);

export const vFriendship = v.object({
  profileIdA: v.id("profiles"),
  profileIdB: v.id("profiles"),
  status: vFriendshipStatus,
  initiatedBy: v.id("profiles"),
});
