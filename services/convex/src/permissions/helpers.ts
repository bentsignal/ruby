import type { Infer } from "convex/values";
import { ConvexError } from "convex/values";

import type { MutationCtx, QueryCtx } from "../_generated/server";
import type { vPermission } from "./validators";

export type UserPermission = Infer<typeof vPermission>;

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

export async function ensureUserPermissionsForUserId(
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
  await ensureGrantedPermissions(ctx, userId, permissions);
  return myProfile;
}

export async function getUserPermissions(
  ctx: QueryCtx | MutationCtx,
  userId: string,
) {
  const permissions = await ctx.db
    .query("permissions")
    .withIndex("by_userId", (q) => q.eq("userId", userId))
    .first();

  return permissions?.permissions ?? [];
}

async function ensureGrantedPermissions(
  ctx: QueryCtx | MutationCtx,
  userId: string,
  permissions: UserPermission[],
) {
  const granted = new Set(await getUserPermissions(ctx, userId));
  const missingPermission = permissions.find(
    (permission) => !granted.has(permission),
  );
  if (missingPermission) {
    throw new ConvexError("Permission denied");
  }
}
