import type { UIFile } from "@acme/convex/files/types";
import type { Id } from "@acme/convex/model";
import {
  POST_UPLOAD_BLOCKED_CONTENT_TYPES,
  POST_UPLOAD_CONTENT_TYPE_MAX_LENGTH,
  POST_UPLOAD_FILE_NAME_MAX_LENGTH,
} from "@acme/config/posts";

import { authClient } from "~/features/auth/lib/client";

export interface CreateUploadArgs {
  contentType: string;
  fileName: string;
  size: number;
}

export interface CreateUploadResult {
  fileId: Id<"files">;
  uploadUrl: string;
}

function isUploadFile(value: unknown): value is UIFile {
  if (!(value instanceof Object)) return false;
  return (
    "_id" in value &&
    typeof value._id === "string" &&
    "contentType" in value &&
    typeof value.contentType === "string" &&
    "mediaType" in value &&
    (value.mediaType === "image" || value.mediaType === "video") &&
    "url" in value &&
    typeof value.url === "string"
  );
}

function getUploadResult(value: unknown) {
  if (!(value instanceof Object)) return { error: "Upload failed" };
  if ("error" in value && typeof value.error === "string") {
    return { error: value.error };
  }
  if ("file" in value && isUploadFile(value.file)) {
    return { file: value.file };
  }
  return { error: "Upload failed" };
}

async function getUploadHeaders(contentType: string) {
  const { data } = await authClient.convex.token({
    fetchOptions: { throw: false },
  });
  if (!data?.token) throw new Error("Unauthenticated");
  return {
    Authorization: `Bearer ${data.token}`,
    "Content-Type": contentType,
  };
}

export async function uploadComposerFile({
  createUpload,
  file,
}: {
  createUpload: (args: CreateUploadArgs) => Promise<CreateUploadResult>;
  file: File;
}) {
  const contentType = file.type || "application/octet-stream";
  const normalizedContentType = normalizeContentType(contentType);
  if (
    file.name.length > POST_UPLOAD_FILE_NAME_MAX_LENGTH ||
    contentType.length > POST_UPLOAD_CONTENT_TYPE_MAX_LENGTH ||
    POST_UPLOAD_BLOCKED_CONTENT_TYPES.some(
      (type) => type === normalizedContentType,
    )
  ) {
    throw new Error("File cannot be uploaded");
  }
  const { uploadUrl } = await createUpload({
    contentType,
    fileName: file.name,
    size: file.size,
  });
  const response = await fetch(uploadUrl, {
    body: file,
    headers: await getUploadHeaders(contentType),
    method: "POST",
  });
  const result = getUploadResult(await response.json());

  if (!response.ok || "error" in result) {
    throw new Error("error" in result ? result.error : "Upload failed");
  }
  return result.file;
}

function normalizeContentType(contentType: string) {
  return contentType.split(";")[0]?.trim().toLowerCase() ?? "";
}
