import { defineSchema, defineTable } from "convex/server";

import { vPost, vProfile } from "./validators";

export default defineSchema(
  {
    posts: defineTable(vPost),
    profiles: defineTable(vProfile)
      .index("by_userId", ["userId"])
      .index("by_username", ["username"]),
  },
  { schemaValidation: true },
);
