import { defineSchema, defineTable } from "convex/server";

import {
  vFile,
  vFriendship,
  vImage,
  vPost,
  vProfile,
  vTrip,
} from "./validators";

export default defineSchema(
  {
    trips: defineTable(vTrip),
    posts: defineTable(vPost).index("by_profileId", ["profileId"]),
    images: defineTable(vImage),
    files: defineTable(vFile)
      .index("by_uploadedBy", ["uploadedBy"])
      .index("by_key", ["key"]),
    profiles: defineTable(vProfile)
      .index("by_userId", ["userId"])
      .index("by_username", ["username"])
      .searchIndex("search_searchTerm", { searchField: "searchTerm" }),
    friends: defineTable(vFriendship)
      .index("by_profileA", ["profileIdA"])
      .index("by_profileB", ["profileIdB"]),
  },
  { schemaValidation: true },
);
