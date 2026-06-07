import { POST_UPLOAD_MAX_SIZE_BYTES } from "@acme/config/posts";

import { httpAction } from "../_generated/server";
import {
  corsHeaders,
  getSizeFromRequest,
  getUploadPermission,
  hasUploadPermission,
  jsonResponse,
  storeUpload,
} from "./upload_http";

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
