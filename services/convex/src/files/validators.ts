import { v } from "convex/values";

export const vFile = v.object({
  contentType: v.string(),
  fileName: v.string(),
  key: v.string(),
  mediaType: v.union(v.literal("image"), v.literal("video")),
  size: v.number(),
  status: v.union(
    v.literal("pending"),
    v.literal("uploading"),
    v.literal("uploaded"),
  ),
  uploadedBy: v.id("profiles"),
  uploadToken: v.optional(v.string()),
  url: v.string(),
});
