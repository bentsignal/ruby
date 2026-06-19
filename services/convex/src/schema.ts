import { defineSchema, defineTable } from "convex/server";

import { vFile } from "./files/validators";
import { vFriendship } from "./friends/validators";
import { vUserPermissions } from "./permissions/validators";
import { vPost } from "./posts/validators";
import { vProfile } from "./profile/validators";
import { vWaitlistEntry } from "./waitlist/validators";

export default defineSchema(
  {
    posts: defineTable(vPost).index("by_profileId", ["profileId"]),
    files: defineTable(vFile)
      .index("by_uploadedBy", ["uploadedBy"])
      .index("by_key", ["key"]),
    profiles: defineTable(vProfile)
      .index("by_userId", ["userId"])
      .index("by_username", ["username"])
      .searchIndex("search_searchTerm", { searchField: "searchTerm" }),
    permissions: defineTable(vUserPermissions).index("by_userId", ["userId"]),
    friends: defineTable(vFriendship)
      .index("by_profileA", ["profileIdA"])
      .index("by_profileB", ["profileIdB"]),
    waitlist: defineTable(vWaitlistEntry).index("by_userId", ["userId"]),
  },
  { schemaValidation: true },
);
