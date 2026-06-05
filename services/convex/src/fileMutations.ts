import { ConvexError, v } from "convex/values";

import { internalMutation } from "./_generated/server";
import {
  publicFile,
  validateUploadSession,
} from "./features/files/upload_session";

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
    validateUploadSession(file, { ...args, expectedStatus: "uploading" });

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
    validateUploadSession(file, { ...args, expectedStatus: "pending" });
    await ctx.db.patch(fileId, {
      status: "uploading",
    });
    return file.key;
  },
});
