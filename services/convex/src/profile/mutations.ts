import { ConvexError, v } from "convex/values";

import type { Doc } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import type { UserPermission } from "../permissions/helpers";
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
    if (existing) {
      await ensurePermissionsRecord(ctx, user.subject, existing);
      return existing;
    }

    const name = user.name ?? "User";
    const username = await generateUsername(ctx, name);
    const profileId = await ctx.db.insert("profiles", {
      userId: user.subject,
      name,
      username,
      searchTerm: `${username} ${name}`,
    });
    await ensurePermissionsRecord(ctx, user.subject);

    const profile = await ctx.db.get("profiles", profileId);
    if (!profile) {
      throw new ConvexError("Failed to create new profile");
    }
    return profile;
  },
});

async function ensurePermissionsRecord(
  ctx: MutationCtx,
  userId: string,
  profile?: Doc<"profiles">,
) {
  const existingPermissions = await ctx.db
    .query("permissions")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  const legacyPermissions = getLegacyPermissions(profile);
  const permissions =
    legacyPermissions ?? existingPermissions?.permissions ?? [];

  if (existingPermissions) {
    await ctx.db.patch(existingPermissions._id, { permissions });
  } else {
    await ctx.db.insert("permissions", { userId, permissions });
  }

  if (profile && legacyPermissions) {
    const patch = Object.fromEntries([["permissions", undefined]]);
    await ctx.db.patch(profile._id, patch);
  }
}

function getLegacyPermissions(profile?: Doc<"profiles">) {
  if (!profile || !("permissions" in profile)) return undefined;
  const { permissions } = profile;
  if (!Array.isArray(permissions)) return undefined;

  return permissions.filter(isUserPermission);
}

function isUserPermission(value: unknown): value is UserPermission {
  return value === "can-access-app" || value === "can-post";
}

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
