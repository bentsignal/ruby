import { ConvexError, v } from "convex/values";

import { createStorageKeyPrefix } from "@acme/app-config/storage";

import type { Id } from "./_generated/dataModel";
import type { ActionCtx } from "./_generated/server";
import { internal } from "./_generated/api";
import { action, httpAction } from "./_generated/server";
import { uploadToBunny } from "./bunny";
import { storageEnv } from "./storage.env";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
type UploadActionCtx = Pick<ActionCtx, "auth" | "runMutation" | "runQuery">;

function corsHeaders() {
  return {
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": "*",
  };
}

function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json",
    },
  });
}

function getMediaType(contentType: string) {
  if (contentType.startsWith("image/")) return "image";
  if (contentType.startsWith("video/")) return "video";
  throw new ConvexError("Only image and video uploads are supported");
}

function getExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension || extension === fileName.toLowerCase()) return "bin";
  return extension.replace(/[^a-z0-9]/g, "") || "bin";
}

function getSizeFromRequest(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return undefined;
  const size = Number(contentLength);
  if (!Number.isFinite(size)) return undefined;
  return size;
}

async function ensureCanPostFromAction(ctx: UploadActionCtx) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) throw new ConvexError("Unauthenticated");
  const profile = await ctx.runQuery(internal.permissions.ensureForUser, {
    permissions: ["can-post"],
    userId: user.subject,
  });
  return { profile, user };
}

async function getUploadPermission(ctx: UploadActionCtx) {
  try {
    return { result: await ensureCanPostFromAction(ctx) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthenticated";
    const status = message === "Unauthenticated" ? 401 : 403;
    return { response: jsonResponse({ error: message }, status) };
  }
}

function hasUploadPermission(
  permission: Awaited<ReturnType<typeof getUploadPermission>>,
): permission is {
  result: Awaited<ReturnType<typeof ensureCanPostFromAction>>;
} {
  return "result" in permission;
}

async function storeUpload(
  ctx: UploadActionCtx,
  request: Request,
  args: {
    contentType: string;
    fileId: string;
    profileId: Id<"profiles">;
    token: string;
  },
) {
  try {
    const body = await request.arrayBuffer();
    if (body.byteLength > MAX_UPLOAD_SIZE_BYTES) {
      return jsonResponse({ error: "File is too large" }, 413);
    }
    const uploadedSize = body.byteLength;
    await uploadToBunny({
      body,
      contentType: args.contentType,
      key: await ctx.runMutation(internal.fileMutations.verifyUpload, {
        contentType: args.contentType,
        fileId: args.fileId,
        profileId: args.profileId,
        size: uploadedSize,
        token: args.token,
      }),
    });

    const file = await ctx.runMutation(internal.fileMutations.completeUpload, {
      contentType: args.contentType,
      fileId: args.fileId,
      profileId: args.profileId,
      size: uploadedSize,
      token: args.token,
    });
    return jsonResponse({ file });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return jsonResponse({ error: message }, 400);
  }
}

export const createUpload = action({
  args: {
    contentType: v.string(),
    fileName: v.string(),
    size: v.number(),
  },
  handler: async (
    ctx,
    args,
  ): Promise<{ fileId: Id<"files">; uploadUrl: string }> => {
    const { profile, user } = await ensureCanPostFromAction(ctx);
    if (args.size <= 0 || args.size > MAX_UPLOAD_SIZE_BYTES) {
      throw new ConvexError("File is too large");
    }

    const mediaType = getMediaType(args.contentType);
    const uploadToken = crypto.randomUUID();
    const storageKeyPrefix = createStorageKeyPrefix();
    const key = [
      ...(storageKeyPrefix ? [storageKeyPrefix] : []),
      "posts",
      user.subject,
      `${Date.now()}-${crypto.randomUUID()}.${getExtension(args.fileName)}`,
    ].join("/");

    const fileId = await ctx.runMutation(internal.fileMutations.createPending, {
      contentType: args.contentType,
      fileName: args.fileName,
      key,
      mediaType,
      profileId: profile._id,
      size: args.size,
      uploadToken,
    });
    const uploadUrl = new URL("/api/files/upload", storageEnv.CONVEX_SITE_URL);
    uploadUrl.searchParams.set("fileId", fileId);
    uploadUrl.searchParams.set("token", uploadToken);

    return {
      fileId,
      uploadUrl: uploadUrl.toString(),
    };
  },
});

export const upload = httpAction(async (ctx: UploadActionCtx, request) => {
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
  if (size !== undefined && size > MAX_UPLOAD_SIZE_BYTES) {
    return jsonResponse({ error: "File is too large" }, 413);
  }

  return await storeUpload(ctx, request, {
    contentType,
    fileId,
    profileId: permission.result.profile._id,
    token,
  });
});
