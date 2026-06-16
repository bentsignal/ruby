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
    caption: v.optional(v.string()),
    fileIds: v.array(v.id("files")),
    location: v.optional(vPostLocation),
  },
  handler: async (ctx, args) => {
    await ensureUserPermissions(ctx, ["can-post"]);
    const caption = validatePostInput(args.caption, args.fileIds);
    const location = validatePostLocation(args.location);
    await validatePostFiles(ctx, args.fileIds);

    return await ctx.db.insert("posts", {
      caption: caption ?? undefined,
      fileIds: args.fileIds,
      imagesIds: [],
      location,
      profileId: ctx.myProfile._id,
    });
  },
});
