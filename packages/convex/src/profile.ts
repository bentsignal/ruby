import { v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import type { PublicProfile } from "./types";
import { query } from "./_generated/server";
import { authedQuery } from "./utils";

export const redactProfileData = (profile: Doc<"profiles">): PublicProfile => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { userId, _creationTime, ...publicProfile } = profile;
  return publicProfile;
};

export const get = query({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args): Promise<PublicProfile | null> => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) {
      return null;
    }
    return redactProfileData(profile);
  },
});

export const getMine = authedQuery({
  handler: async (ctx) => {
    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user.subject))
      .first();
    if (!myProfile) {
      return null;
    }
    return myProfile;
  },
});
