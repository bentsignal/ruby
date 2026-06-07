import { ConvexError, v } from "convex/values";

import type { MutationCtx } from "../_generated/server";
import { internal } from "../_generated/api";
import { internalMutation, mutation } from "../_generated/server";

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
      await ctx.scheduler.runAfter(0, internal.files.uploadthing.uploadPFP, {
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
