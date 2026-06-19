import { v } from "convex/values";

export const vLike = v.object({
  postId: v.id("posts"),
  profileId: v.id("profiles"),
});
