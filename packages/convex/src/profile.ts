import { v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import type { UIProfile } from "./types";
import { internalMutation, query } from "./_generated/server";
import { authedQuery } from "./utils";

export const DeletedProfile = {
  username: "deleted_user",
  name: "Deleted User",
  image: undefined,
} satisfies UIProfile;

export const getPublicProfile = (profile: Doc<"profiles">): UIProfile => {
  const { userId: _userId, _creationTime, _id, ...publicProfile } = profile;
  return publicProfile;
};

export const get = query({
  args: {
    profileId: v.id("profiles"),
  },
  handler: async (ctx, args): Promise<UIProfile | null> => {
    const profile = await ctx.db.get(args.profileId);
    if (!profile) {
      return null;
    }
    return getPublicProfile(profile);
  },
});

export const getMine = authedQuery({
  handler: async (ctx): Promise<UIProfile | null> => {
    const myProfile = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", ctx.user.subject))
      .first();
    if (!myProfile) {
      return null;
    }
    return getPublicProfile(myProfile);
  },
});

export const updatePFP = internalMutation({
  args: {
    profileId: v.id("profiles"),
    image: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.profileId, {
      image: args.image,
    });
  },
});
