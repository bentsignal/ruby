import * as FileSystem from "expo-file-system/legacy";
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
  const createUpload = useConvexMutation(api.files.mutations.createUpload);

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
    const size = await getFileSize(item);
    if (size > POST_UPLOAD_MAX_SIZE_BYTES) {
      throw new Error(
        `Files must be ${POST_UPLOAD_MAX_SIZE_LABEL} or smaller.`,
      );
    }

    const { uploadUrl } = await createUpload({
      contentType,
      fileName,
      size,
    });
    const uploadResponse = await FileSystem.uploadAsync(
      uploadUrl,
      item.file.uri,
      {
        headers: await getUploadHeaders(contentType),
        httpMethod: "POST",
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
      },
    );
    const result = getUploadResultFromBody(uploadResponse.body);
    if (uploadResponse.status < 200 || uploadResponse.status >= 300) {
      throw new Error(getUploadError(result));
    }
    if ("error" in result) {
      throw new Error(getUploadError(result));
    }

    return result.file;
  }

  return { uploadItem };
}

async function getFileSize(item: ComposerItem) {
  if (item.file.fileSize !== undefined) return item.file.fileSize;

  const info = await FileSystem.getInfoAsync(item.file.uri);
  if (info.exists) return info.size;

  throw new Error("Selected file could not be read");
}

function getErrorMessage(caughtError: unknown, fallback: string) {
  if (caughtError instanceof Error) return caughtError.message;

  return fallback;
}

function getUploadResultFromBody(body: string) {
  try {
    return getUploadResult(JSON.parse(body));
  } catch {
    return { error: "Upload failed" };
  }
}

function getUploadError(result: ReturnType<typeof getUploadResult>) {
  if ("error" in result) return result.error;

  return "Upload failed";
}
