import { v } from "convex/values";

export const vTrip = v.object({
  creatorId: v.id("profiles"),
  name: v.string(),
  imageId: v.optional(v.id("images")),
  description: v.optional(v.string()),
  location: v.optional(v.string()),
  startDate: v.optional(v.number()),
  endDate: v.optional(v.number()),
});
