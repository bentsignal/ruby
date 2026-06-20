import { v } from "convex/values";

import { getFriendProfileIds } from "../friends/helpers";
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

    const postId = await ctx.db.insert("posts", {
      attachments: args.attachments,
      caption: caption ?? undefined,
      location,
      profileId: ctx.myProfile._id,
    });

    const friendProfileIds = await getFriendProfileIds(ctx, ctx.myProfile._id);
    await Promise.all(
      friendProfileIds.map(async (profileId) => {
        return await ctx.db.insert("feedItems", {
          profileId,
          postId,
          creatorProfileId: ctx.myProfile._id,
        });
      }),
    );

    return postId;
  },
});
