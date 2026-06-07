import { v } from "convex/values";

import { internalQuery } from "../_generated/server";
import { ensureUserPermissionsForUserId } from "./helpers";
import { vPermission } from "./validators";

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
