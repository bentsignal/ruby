import { v } from "convex/values";

export const vProfile = v.object({
  userId: v.string(),
  name: v.string(),
  username: v.string(),
  image: v.optional(v.string()),
  bio: v.optional(v.string()),
  link: v.optional(v.string()),
  searchTerm: v.string(),
});
