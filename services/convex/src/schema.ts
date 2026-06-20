import { defineSchema, defineTable } from "convex/server";

import { vFile } from "./files/validators";
import { vFriendship } from "./friends/validators";
import { vLike } from "./likes/validators";
import { vUserPermissions } from "./permissions/validators";
import { vFeedItem, vPost } from "./posts/validators";
import { vProfile } from "./profile/validators";
import { vWaitlistEntry } from "./waitlist/validators";

export default defineSchema(
  {
    posts: defineTable(vPost).index("by_profileId", ["profileId"]),
    feedItems: defineTable(vFeedItem)
      .index("by_profileId", ["profileId"])
      .index("by_profile_creator", ["profileId", "creatorProfileId"]),
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
    likes: defineTable(vLike)
      .index("by_post", ["postId"])
      .index("by_profile_post", ["profileId", "postId"]),
    waitlist: defineTable(vWaitlistEntry).index("by_userId", ["userId"]),
  },
  { schemaValidation: true },
);
