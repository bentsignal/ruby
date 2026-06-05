import { ConvexError, v } from "convex/values";

import type { Doc } from "./_generated/dataModel";
import { internalMutation } from "./_generated/server";
import { createPublicUrl } from "./bunny";

export const createPending = internalMutation({
  args: {
    contentType: v.string(),
    fileName: v.string(),
    key: v.string(),
    mediaType: v.union(v.literal("image"), v.literal("video")),
    profileId: v.id("profiles"),
    size: v.number(),
    uploadToken: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("files", {
      contentType: args.contentType,
      fileName: args.fileName,
      key: args.key,
      mediaType: args.mediaType,
      size: args.size,
      status: "pending",
      uploadToken: args.uploadToken,
      uploadedBy: args.profileId,
      url: createPublicUrl(args.key),
    });
  },
});

export const completeUpload = internalMutation({
  args: {
    contentType: v.string(),
    fileId: v.string(),
    profileId: v.id("profiles"),
    size: v.optional(v.number()),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const fileId = ctx.db.normalizeId("files", args.fileId);
    if (!fileId) throw new ConvexError("Invalid upload session");
    const file = await ctx.db.get(fileId);
    validateUploadSession(file, args);

    await ctx.db.patch(fileId, {
      status: "uploaded",
      uploadToken: undefined,
    });

    const uploadedFile = await ctx.db.get(fileId);
    if (!uploadedFile) throw new ConvexError("Uploaded file not found");
    return publicFile(uploadedFile);
  },
});

export const verifyUpload = internalMutation({
  args: {
    contentType: v.string(),
    fileId: v.string(),
    profileId: v.id("profiles"),
    size: v.optional(v.number()),
    token: v.string(),
  },
  handler: async (ctx, args) => {
    const fileId = ctx.db.normalizeId("files", args.fileId);
    if (!fileId) throw new ConvexError("Invalid upload session");
    const file = await ctx.db.get(fileId);
    validateUploadSession(file, args);
    return file.key;
  },
});

function validateUploadSession(
  file: Doc<"files"> | null,
  args: {
    contentType: string;
    profileId: Doc<"profiles">["_id"];
    size?: number;
    token: string;
  },
): asserts file is Doc<"files"> {
  if (!file || file.uploadToken !== args.token || file.status !== "pending") {
    throw new ConvexError("Invalid upload session");
  }
  if (file.contentType !== args.contentType) {
    throw new ConvexError("Upload content type does not match session");
  }
  if (file.uploadedBy !== args.profileId) {
    throw new ConvexError("Invalid upload session");
  }
  if (args.size !== undefined && args.size > file.size) {
    throw new ConvexError("Upload size does not match session");
  }
}

function publicFile(file: Doc<"files">) {
  const { uploadToken: _uploadToken, ...publicFields } = file;
  return publicFields;
}
