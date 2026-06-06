import { useConvexMutation } from "@convex-dev/react-query";

import {
  POST_UPLOAD_MAX_SIZE_BYTES,
  POST_UPLOAD_MAX_SIZE_LABEL,
} from "@acme/config/posts";
import { api } from "@acme/convex/api";

import type { ComposerItem } from "../types";
import {
  getFallbackContentType,
  getFallbackFileName,
  getUploadHeaders,
  getUploadResult,
} from "../utils/upload-files";

export function useUploadItem({
  updateItem,
}: {
  updateItem: (itemId: string, patch: Partial<ComposerItem>) => void;
}) {
  const createUpload = useConvexMutation(api.files.createUpload);

  async function uploadItem(item: ComposerItem) {
    if (item.status === "uploaded" && item.uploadedFile) {
      return item.uploadedFile;
    }

    updateItem(item.id, {
      error: undefined,
      status: "uploading",
      uploadedFile: undefined,
    });

    try {
      const file = await uploadReadyItem(item);
      updateItem(item.id, { status: "uploaded", uploadedFile: file });
      return file;
    } catch (caughtError) {
      const message = getErrorMessage(caughtError, "Upload failed");
      updateItem(item.id, { error: message, status: "error" });
      throw new Error(message);
    }
  }

  async function uploadReadyItem(item: ComposerItem) {
    const contentType = item.file.mimeType ?? getFallbackContentType(item.file);
    const fileName = item.file.fileName ?? getFallbackFileName(item.file);
    const fileResponse = await fetch(item.file.uri);
    const body = await fileResponse.blob();
    if (body.size > POST_UPLOAD_MAX_SIZE_BYTES) {
      throw new Error(
        `Files must be ${POST_UPLOAD_MAX_SIZE_LABEL} or smaller.`,
      );
    }

    const { uploadUrl } = await createUpload({
      contentType,
      fileName,
      size: item.file.fileSize ?? body.size,
    });
    const uploadResponse = await fetch(uploadUrl, {
      method: "POST",
      headers: await getUploadHeaders(contentType),
      body,
    });
    const result = getUploadResult(await uploadResponse.json());
    if (!uploadResponse.ok || "error" in result) {
      throw new Error(getUploadError(result));
    }

    return result.file;
  }

  return { uploadItem };
}

function getErrorMessage(caughtError: unknown, fallback: string) {
  if (caughtError instanceof Error) return caughtError.message;

  return fallback;
}

function getUploadError(result: ReturnType<typeof getUploadResult>) {
  if ("error" in result) return result.error;

  return "Upload failed";
}
