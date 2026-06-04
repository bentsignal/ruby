import { ConvexError, v } from "convex/values";

import type { Doc, Id } from "./_generated/dataModel";
import type { UIImage } from "./types";
import type { AuthedMutationCtx, AuthedQueryCtx } from "./utils";
import { DeletedProfile, getPublicProfile } from "./profile";
import { authedMutation, authedQuery } from "./utils";

const MAX_CAPTION_LENGTH = 2_200;
const MAX_POST_FILES = 20;

export const create = authedMutation({
  args: {
    caption: v.optional(v.string()),
    fileIds: v.array(v.id("files")),
  },
  handler: async (ctx, args) => {
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

function validatePostInput(
  rawCaption: string | undefined,
  fileIds: Id<"files">[],
) {
  const caption = rawCaption?.trim();
  if (!caption && fileIds.length === 0) {
    throw new ConvexError("Add media or a caption before posting");
  }
  if (caption && caption.length > MAX_CAPTION_LENGTH) {
    throw new ConvexError("Caption is too long");
  }
  if (fileIds.length > MAX_POST_FILES) {
    throw new ConvexError("Too many files");
  }
  if (new Set(fileIds).size !== fileIds.length) {
    throw new ConvexError("Duplicate files are not supported");
  }
  return caption;
}

async function validatePostFiles(
  ctx: AuthedMutationCtx,
  fileIds: Id<"files">[],
) {
  for (const fileId of fileIds) {
    const file = await ctx.db.get(fileId);
    if (!file) throw new ConvexError("File not found");
    if (file.uploadedBy !== ctx.myProfile._id) {
      throw new ConvexError("You can only post your own uploads");
    }
    if (file.status !== "uploaded") {
      throw new ConvexError("Wait for uploads to finish before posting");
    }
  }
}

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

async function getUIPosts(ctx: AuthedQueryCtx, posts: Doc<"posts">[]) {
  const uiPosts = await Promise.all(
    posts.map(async (post) => {
      const profile = await ctx.db.get(post.profileId);
      const { imagesIds, ...rest } = post;
      const imageResults = await Promise.all(
        (imagesIds ?? []).map(async (imageId) => {
          return await ctx.db.get(imageId);
        }),
      );
      const images = imageResults
        .filter((image) => image !== null)
        .map((image) => ({
          url: image.url,
        })) satisfies UIImage[];
      const fileResults = await Promise.all(
        (post.fileIds ?? []).map(async (fileId) => {
          return await ctx.db.get(fileId);
        }),
      );
      const files = fileResults
        .filter((file) => file !== null)
        .map(({ uploadToken: _uploadToken, ...file }) => file);
      return {
        ...rest,
        creator: profile ? getPublicProfile(profile) : DeletedProfile,
        files,
        images,
      };
    }),
  );
  return uiPosts;
}
