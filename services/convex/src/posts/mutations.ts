import { v } from "convex/values";

import { ensureUserPermissions } from "../permissions/helpers";
import { authedMutation } from "../utils";
import {
  validatePostFiles,
  validatePostInput,
  validatePostLocation,
} from "./validation";
import { vPostLocation } from "./validators";

export const create = authedMutation({
  args: {
    attachments: v.array(v.id("files")),
    caption: v.optional(v.string()),
    location: v.optional(vPostLocation),
  },
  handler: async (ctx, args) => {
    await ensureUserPermissions(ctx, ["can-post"]);
    const caption = validatePostInput(args.caption, args.attachments);
    const location = validatePostLocation(args.location);
    await validatePostFiles(ctx, args.attachments);

    return await ctx.db.insert("posts", {
      attachments: args.attachments,
      caption: caption ?? undefined,
      location,
      profileId: ctx.myProfile._id,
    });
  },
});
