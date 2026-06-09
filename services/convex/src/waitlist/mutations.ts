import { authedMutation } from "../utils";

export const join = authedMutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("waitlist")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user.subject))
      .first();

    if (existing) {
      return;
    }

    await ctx.db.insert("waitlist", {
      userId: ctx.user.subject,
      hasAccess: false,
    });
  },
});
