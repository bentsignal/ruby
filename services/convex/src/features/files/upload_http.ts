import { ConvexError } from "convex/values";

import type { Doc, Id } from "../../_generated/dataModel";
import type { ActionCtx } from "../../_generated/server";
import { internal } from "../../_generated/api";
import { uploadToBunny } from "../../bunny";
import { MAX_UPLOAD_SIZE_BYTES } from "./constants";

type UploadActionCtx = Pick<ActionCtx, "auth" | "runMutation" | "runQuery">;
type UploadPermission =
  | { result: { profile: Doc<"profiles"> } }
  | { response: Response };

export function corsHeaders() {
  return {
    "Access-Control-Allow-Headers": "authorization, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": "*",
  };
}

export function jsonResponse(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json",
    },
  });
}

export function getSizeFromRequest(request: Request) {
  const contentLength = request.headers.get("content-length");
  if (!contentLength) return undefined;
  const size = Number(contentLength);
  if (!Number.isFinite(size)) return undefined;
  return size;
}

export async function getUploadPermission(ctx: UploadActionCtx) {
  try {
    return { result: await ensureCanPostFromAction(ctx) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthenticated";
    const status = message === "Unauthenticated" ? 401 : 403;
    return { response: jsonResponse({ error: message }, status) };
  }
}

export function hasUploadPermission(
  permission: UploadPermission,
): permission is {
  result: { profile: Doc<"profiles"> };
} {
  return "result" in permission;
}

export async function storeUpload(
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

async function ensureCanPostFromAction(ctx: UploadActionCtx) {
  const user = await ctx.auth.getUserIdentity();
  if (!user) throw new ConvexError("Unauthenticated");
  const profile = await ctx.runQuery(internal.permissions.ensureForUser, {
    permissions: ["can-post"],
    userId: user.subject,
  });
  return { profile };
}
