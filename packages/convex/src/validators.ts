import { v } from "convex/values";

const vProfile = v.object({
  userId: v.string(),
  name: v.string(),
  username: v.string(),
  image: v.optional(v.string()),
});

const vPost = v.object({
  profileId: v.id("profiles"),
  caption: v.optional(v.string()),
  imageUrls: v.array(v.string()),
});

export { vProfile, vPost };
