import { v } from "convex/values";

import type { Id } from "../_generated/dataModel";
import { ensureUserPermissions } from "../permissions/helpers";
import { authedMutation } from "../utils";
import { createPublicUrl } from "./bunny";
import {
  getMediaType,
  getUploadKey,
  getUploadUrl,
  validateUploadSize,
} from "./upload_session";

export const createUpload = authedMutation({
  args: {
    contentType: v.string(),
    fileName: v.string(),
    size: v.number(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ fileId: Id<"files">; uploadUrl: string }> => {
    await ensureUserPermissions(ctx, ["can-post"]);
    validateUploadSize(args.size);
    const mediaType = getMediaType(args.contentType);
    const uploadToken = crypto.randomUUID();
    const key = getUploadKey({
      fileName: args.fileName,
      now: Date.now(),
      uploadId: crypto.randomUUID(),
      userId: ctx.user.subject,
    });
    const fileId = await ctx.db.insert("files", {
      contentType: args.contentType,
      fileName: args.fileName,
      key,
      mediaType,
      size: args.size,
      status: "pending",
      uploadToken,
      uploadedBy: ctx.myProfile._id,
      url: createPublicUrl(key),
    });

    return {
      fileId,
      uploadUrl: getUploadUrl({ fileId, token: uploadToken }),
    };
  },
});
