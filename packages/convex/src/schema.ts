import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

import { vProfile } from "./validators";

export default defineSchema(
  {
    posts: defineTable({
      title: v.string(),
      content: v.string(),
    }),
    profiles: defineTable(vProfile)
      .index("by_userId", ["userId"])
      .index("by_username", ["username"]),
  },
  { schemaValidation: true },
);
