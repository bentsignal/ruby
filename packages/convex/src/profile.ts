import { paginationOptsValidator } from "convex/server";
import { ConvexError, v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import type { MutationCtx } from "./_generated/server";
import type { Relationship, UIProfile } from "./types";
import { internal } from "./_generated/api";
import { internalMutation, mutation } from "./_generated/server";
import { getRelationshipHelper } from "./friends";
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

async function generateUsername(ctx: MutationCtx, name: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 15);
  const slug = base || "user";
  let candidate = slug;
  let suffix = 1;
  while (
    await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", candidate))
      .first()
  ) {
    candidate = `${slug}${suffix++}`;
  }
  return candidate;
}

export const ensureProfileExists = mutation({
  handler: async (ctx) => {
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthenticated");

    const existing = await ctx.db
      .query("profiles")
      .withIndex("by_userId", (q) => q.eq("userId", user.subject))
      .first();
    if (existing) return existing;

    const name = user.name ?? "User";
    const username = await generateUsername(ctx, name);
    const profileId = await ctx.db.insert("profiles", {
      userId: user.subject,
      name,
      username,
      searchTerm: `${username} ${name}`,
    });

    if (user.pictureUrl) {
      await ctx.scheduler.runAfter(0, internal.uploadthing.uploadPFP, {
        profileId,
        url: user.pictureUrl,
      });
    }
    const profile = await ctx.db.get("profiles", profileId);
    if (!profile) {
      throw new ConvexError("Failed to create new profile");
    }
    return profile;
  },
});

export const getByUsername = authedQuery({
  args: {
    username: v.string(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{
    info: UIProfile;
    relationship: Relationship;
  } | null> => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) return null;
    const { relationship } = await getRelationshipHelper({
      ctx,
      profileRequestingInfo: ctx.myProfile._id,
      otherProfile: profile._id,
    });
    return {
      info: getPublicProfile(profile),
      relationship,
    };
  },
});

export const getMine = authedQuery({
  handler: (ctx) => {
    return getPublicProfile(ctx.myProfile);
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

export const search = authedQuery({
  args: {
    searchTerm: v.string(),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const trimmedSearchTerm = args.searchTerm.trim();
    if (!trimmedSearchTerm) {
      return {
        page: [] as UIProfile[],
        isDone: true,
        continueCursor: "",
      };
    }

    const results = await ctx.db
      .query("profiles")
      .withSearchIndex("search_searchTerm", (q) =>
        q.search("searchTerm", trimmedSearchTerm),
      )
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: results.page.map(getPublicProfile),
    };
  },
});
