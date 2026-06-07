import type { UIFile } from "@acme/convex/files/types";

import type { PickedFile } from "../types";
import { authClient } from "~/features/auth/lib/auth-client";

export function getFallbackContentType(file: PickedFile) {
  if (file.type === "video") return "video/mp4";

  return "image/jpeg";
}

export function getFallbackFileName(file: PickedFile) {
  const extension = getFallbackContentType(file).split("/")[1] ?? "bin";
  return `upload-${Date.now()}.${extension}`;
}

export async function getUploadHeaders(contentType: string) {
  const { data } = await authClient.convex.token({
    fetchOptions: { throw: false },
  });
  if (!data?.token) throw new Error("Unauthenticated");
  return {
    Authorization: `Bearer ${data.token}`,
    "Content-Type": contentType,
  };
}

export function getUploadResult(value: unknown) {
  if (!(value instanceof Object)) return { error: "Upload failed" };
  if ("error" in value && typeof value.error === "string") {
    return { error: value.error };
  }
  if ("file" in value && isUploadFile(value.file)) {
    return { file: value.file };
  }
  return { error: "Upload failed" };
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
