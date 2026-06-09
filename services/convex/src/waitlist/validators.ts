import { v } from "convex/values";

export const vWaitlistEntry = v.object({
  userId: v.string(),
  hasAccess: v.boolean(),
});
