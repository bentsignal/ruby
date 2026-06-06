import { v } from "convex/values";

import { POST_UPLOAD_MAX_SIZE_BYTES } from "@acme/config/posts";

import type { Id } from "./_generated/dataModel";
import { httpAction } from "./_generated/server";
import { createPublicUrl } from "./bunny";
import {
  corsHeaders,
  getSizeFromRequest,
  getUploadPermission,
  hasUploadPermission,
  jsonResponse,
  storeUpload,
} from "./features/files/upload_http";
import {
  getMediaType,
  getUploadKey,
  getUploadUrl,
  validateUploadSize,
} from "./features/files/upload_session";
import { ensureUserPermissions } from "./permissions";
import { authedMutation } from "./utils";

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

export const upload = httpAction(async (ctx, request) => {
  if (request.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders() });
  }
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, 405);
  }

  const url = new URL(request.url);
  const fileId = url.searchParams.get("fileId");
  const token = url.searchParams.get("token");
  const contentType =
    request.headers.get("content-type") ?? "application/octet-stream";
  const size = getSizeFromRequest(request);

  const permission = await getUploadPermission(ctx);
  if (!hasUploadPermission(permission)) {
    return permission.response;
  }

  if (!fileId || !token) {
    return jsonResponse({ error: "Missing upload session" }, 401);
  }
  if (size !== undefined && size > POST_UPLOAD_MAX_SIZE_BYTES) {
    return jsonResponse({ error: "File is too large" }, 413);
  }

  return await storeUpload(ctx, request, {
    contentType,
    fileId,
    profileId: permission.result.profile._id,
    token,
  });
});
