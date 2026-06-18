import { v } from "convex/values";

import { internalQuery } from "../_generated/server";
import { authedQuery } from "../utils";
import { ensureUserPermissionsForUserId, getUserPermissions } from "./helpers";
import { vPermission } from "./validators";

export const getMine = authedQuery({
  handler: async (ctx) => {
    return await getUserPermissions(ctx, ctx.user.subject);
  },
});

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
