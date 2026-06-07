import { v } from "convex/values";

import { vPermission } from "../permissions/validators";

export const vProfile = v.object({
  userId: v.string(),
  name: v.string(),
  username: v.string(),
  image: v.optional(v.string()),
  bio: v.optional(v.string()),
  link: v.optional(v.string()),
  permissions: v.optional(v.array(vPermission)),
  searchTerm: v.string(),
});
