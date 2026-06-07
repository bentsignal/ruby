import { v } from "convex/values";

export const vPost = v.object({
  tripId: v.optional(v.id("trips")),
  profileId: v.id("profiles"),
  fileIds: v.optional(v.array(v.id("files"))),
  imagesIds: v.optional(v.array(v.id("images"))),
  caption: v.optional(v.string()),
});
