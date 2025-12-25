import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema(
  {
    posts: defineTable({
      title: v.string(),
      content: v.string(),
    }),
    profiles: defineTable({
      userId: v.string(),
      name: v.string(),
      image: v.optional(v.string()),
    }).index("by_userId", ["userId"]),
  },
  { schemaValidation: true },
);
