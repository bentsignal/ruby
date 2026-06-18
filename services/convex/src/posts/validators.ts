import { v } from "convex/values";

export const vPostLocation = v.object({
  provider: v.literal("google"),
  googlePlaceId: v.string(),
  name: v.optional(v.string()),
  formattedAddress: v.optional(v.string()),
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
});

export const vPost = v.object({
  tripId: v.optional(v.id("trips")),
  profileId: v.id("profiles"),
  fileIds: v.optional(v.array(v.id("files"))),
  imagesIds: v.optional(v.array(v.id("images"))),
  caption: v.optional(v.string()),
  location: v.optional(vPostLocation),
});
