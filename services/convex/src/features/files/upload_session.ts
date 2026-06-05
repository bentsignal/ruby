import { ConvexError } from "convex/values";

import { createStorageKeyPrefix } from "@acme/app-config/storage";

import type { Doc, Id } from "../../_generated/dataModel";
import { storageEnv } from "../../storage.env";
import { MAX_UPLOAD_SIZE_BYTES } from "./constants";

export function getMediaType(contentType: string) {
  if (contentType.startsWith("image/")) return "image";
  if (contentType.startsWith("video/")) return "video";
  throw new ConvexError("Only image and video uploads are supported");
}

export function getUploadKey(args: {
  fileName: string;
  now: number;
  uploadId: string;
  userId: string;
}) {
  const storageKeyPrefix = createStorageKeyPrefix();
  return [
    ...(storageKeyPrefix ? [storageKeyPrefix] : []),
    "posts",
    args.userId,
    `${args.now}-${args.uploadId}.${getExtension(args.fileName)}`,
  ].join("/");
}

export function getUploadUrl(args: { fileId: Id<"files">; token: string }) {
  const uploadUrl = new URL("/api/files/upload", storageEnv.CONVEX_SITE_URL);
  uploadUrl.searchParams.set("fileId", args.fileId);
  uploadUrl.searchParams.set("token", args.token);
  return uploadUrl.toString();
}

export function validateUploadSize(size: number) {
  if (size <= 0 || size > MAX_UPLOAD_SIZE_BYTES) {
    throw new ConvexError("File is too large");
  }
}

export function validateUploadSession(
  file: Doc<"files"> | null,
  args: {
    contentType: string;
    expectedStatus: Doc<"files">["status"];
    profileId: Doc<"profiles">["_id"];
    size?: number;
    token: string;
  },
): asserts file is Doc<"files"> {
  if (
    !file ||
    file.uploadToken !== args.token ||
    file.status !== args.expectedStatus
  ) {
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

export function publicFile(file: Doc<"files">) {
  const { uploadToken: _uploadToken, ...publicFields } = file;
  return publicFields;
}

function getExtension(fileName: string) {
  const extension = fileName.split(".").pop()?.toLowerCase();
  if (!extension || extension === fileName.toLowerCase()) return "bin";
  return extension.replace(/[^a-z0-9]/g, "") || "bin";
}
