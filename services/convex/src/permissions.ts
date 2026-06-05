import type { Infer } from "convex/values";
import { ConvexError, v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import { internalQuery } from "./_generated/server";
import { vPermission } from "./features/permissions/validators";

type UserPermission = Infer<typeof vPermission>;

export const ensureForUser = internalQuery({
  args: {
    permissions: v.array(vPermission),
    userId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ensureUserPermissionsForUserId(
      ctx,
      args.userId,
      args.permissions,
    );
  },
});

export async function ensureUserPermissions(
  ctx: QueryCtx | MutationCtx,
  permissions: UserPermission[],
) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) {
    throw new ConvexError("Unauthenticated");
  }
  const myProfile = await ensureUserPermissionsForUserId(
    ctx,
    user.subject,
    permissions,
  );
  return { user, myProfile };
}

async function ensureUserPermissionsForUserId(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  permissions: UserPermission[],
) {
  const myProfile = await ctx.db
    .query("profiles")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();
  if (!myProfile) {
    throw new ConvexError("Profile not found");
  }
  ensureProfilePermissions(myProfile, permissions);
  return myProfile;
}

function ensureProfilePermissions(
  profile: Doc<"profiles">,
  permissions: UserPermission[],
) {
  const granted = new Set(profile.permissions ?? []);
  const missingPermission = permissions.find(
    (permission) => !granted.has(permission),
  );
  if (missingPermission) {
    throw new ConvexError("Permission denied");
  }
}

export type { UserPermission };
