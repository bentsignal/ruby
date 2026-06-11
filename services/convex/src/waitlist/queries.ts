import { authedQuery } from "../utils";

export const getMyStatus = authedQuery({
  args: {},
  handler: async (ctx) => {
    const entry = await ctx.db
      .query("waitlist")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user.subject))
      .first();

    if (!entry) return null;
    if (entry.hasAccess) return "has-access" as const;
    return "on-waitlist" as const;
  },
});
