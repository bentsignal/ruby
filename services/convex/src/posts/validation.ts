import { ConvexError } from "convex/values";

import { POST_CAPTION_MAX_LENGTH, POST_MAX_FILES } from "@acme/config/posts";

import type { Id } from "../_generated/dataModel";
import type { AuthedMutationCtx } from "../utils";

export function validatePostInput(
  rawCaption: string | undefined,
  fileIds: Id<"files">[],
) {
  const caption = rawCaption?.trim();
  if (!caption && fileIds.length === 0) {
    throw new ConvexError("Add media or a caption before posting");
  }
  if (caption && caption.length > POST_CAPTION_MAX_LENGTH) {
    throw new ConvexError("Caption is too long");
  }
  if (fileIds.length > POST_MAX_FILES) {
    throw new ConvexError("Too many files");
  }
  if (new Set(fileIds).size !== fileIds.length) {
    throw new ConvexError("Duplicate files are not supported");
  }
  return caption;
}

export async function validatePostFiles(
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
