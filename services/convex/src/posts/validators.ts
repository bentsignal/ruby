import { v } from "convex/values";

export const vPostLocation = v.object({
  provider: v.literal("google"),
  googlePlaceId: v.string(),
});

export const vPost = v.object({
  tripId: v.optional(v.id("trips")),
  profileId: v.id("profiles"),
  fileIds: v.optional(v.array(v.id("files"))),
  imagesIds: v.optional(v.array(v.id("images"))),
  caption: v.optional(v.string()),
  location: v.optional(vPostLocation),
});
