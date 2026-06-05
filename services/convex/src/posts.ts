import { v } from "convex/values";

import { validatePostFiles, validatePostInput } from "./features/posts/create";
import { getUIPosts } from "./features/posts/read";
import { ensureUserPermissions } from "./permissions";
import { authedMutation, authedQuery } from "./utils";

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

export const getAll = authedQuery({
  args: {},
  handler: async (ctx) => {
    const posts = await ctx.db.query("posts").order("desc").collect();
    return await getUIPosts(ctx, posts);
  },
});

export const getByUsername = authedQuery({
  args: {
    username: v.string(),
  },
  handler: async (ctx, args) => {
    const profile = await ctx.db
      .query("profiles")
      .withIndex("by_username", (q) => q.eq("username", args.username))
      .first();
    if (!profile) return [];

    const posts = await ctx.db
      .query("posts")
      .withIndex("by_profileId", (q) => q.eq("profileId", profile._id))
      .order("desc")
      .collect();

    return await getUIPosts(ctx, posts);
  },
});
