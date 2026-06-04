import { ConvexError, v } from "convex/values";

import { createStorageKeyPrefix } from "@acme/app-config/storage";

import type { Id } from "./_generated/dataModel";
import { internal } from "./_generated/api";
import { action, httpAction } from "./_generated/server";
import { uploadToBunny } from "./bunny";
import { storageEnv } from "./storage.env";

const MAX_UPLOAD_SIZE_BYTES = 100 * 1024 * 1024;

function corsHeaders() {
  return {
    "Access-Control-Allow-Headers": "content-type",
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
    const user = await ctx.auth.getUserIdentity();
    if (!user) throw new ConvexError("Unauthenticated");
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
      size: args.size,
      uploadToken,
      userId: user.subject,
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

  if (!fileId || !token) {
    return jsonResponse({ error: "Missing upload session" }, 401);
  }
  if (size !== undefined && size > MAX_UPLOAD_SIZE_BYTES) {
    return jsonResponse({ error: "File is too large" }, 413);
  }

  try {
    const body = await request.arrayBuffer();
    await uploadToBunny({
      body,
      contentType,
      key: await ctx.runMutation(internal.fileMutations.verifyUpload, {
        contentType,
        fileId,
        size,
        token,
      }),
    });

    const file = await ctx.runMutation(internal.fileMutations.completeUpload, {
      contentType,
      fileId,
      size,
      token,
    });
    return jsonResponse({ file });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return jsonResponse({ error: message }, 400);
  }
});
