import { v } from "convex/values";

import { ensureUserPermissions } from "../permissions/helpers";
import { authedMutation } from "../utils";
import { validatePostFiles, validatePostInput } from "./validation";

export const create = authedMutation({
  args: {
    caption: v.optional(v.string()),
    fileIds: v.array(v.id("files")),
  },
  handler: async (ctx, args) => {
    await ensureUserPermissions(ctx, ["can-post"]);
    const caption = validatePostInput(args.caption, args.fileIds);
    await validatePostFiles(ctx, args.fileIds);

    return await ctx.db.insert("posts", {
      caption: caption ?? undefined,
      fileIds: args.fileIds,
      imagesIds: [],
      profileId: ctx.myProfile._id,
    });
  },
});
