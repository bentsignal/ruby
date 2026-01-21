import { defineSchema, defineTable } from "convex/server";

import { vImage, vPost, vProfile, vTrip } from "./validators";

export default defineSchema(
  {
    trips: defineTable(vTrip),
    posts: defineTable(vPost),
    images: defineTable(vImage),
    profiles: defineTable(vProfile)
      .index("by_userId", ["userId"])
      .index("by_username", ["username"]),
  },
  { schemaValidation: false },
);
