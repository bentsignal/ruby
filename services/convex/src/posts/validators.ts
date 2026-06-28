import { v } from "convex/values";

export const vPostLocation = v.object({
  provider: v.literal("google"),
  googlePlaceId: v.string(),
  name: v.optional(v.string()),
  formattedAddress: v.optional(v.string()),
  latitude: v.optional(v.number()),
  longitude: v.optional(v.number()),
});

export const vPostDisplayAspectRatio = v.union(
  v.literal("1:1"),
  v.literal("4:3"),
  v.literal("3:4"),
  v.literal("16:9"),
);

export const vPost = v.object({
  profileId: v.id("profiles"),
  attachments: v.optional(v.array(v.id("files"))),
  caption: v.optional(v.string()),
  displayAspectRatio: v.optional(vPostDisplayAspectRatio),
  location: v.optional(vPostLocation),
});

export const vFeedItem = v.object({
  profileId: v.id("profiles"),
  postId: v.id("posts"),
  creatorProfileId: v.id("profiles"),
});
