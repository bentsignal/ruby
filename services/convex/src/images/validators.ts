import { v } from "convex/values";

export const vImage = v.object({
  url: v.string(),
  alt: v.optional(v.string()),
});
