import type { Dispatch, SetStateAction } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";

import {
  POST_UPLOAD_BLOCKED_CONTENT_TYPES,
  POST_UPLOAD_CONTENT_TYPE_MAX_LENGTH,
  POST_UPLOAD_FILE_NAME_MAX_LENGTH,
  POST_UPLOAD_MAX_SIZE_BYTES,
  POST_UPLOAD_MAX_SIZE_LABEL,
} from "@acme/config/posts";

import type { ComposerItem } from "../types";

export async function pickComposerFiles({
  setItems,
}: {
  setItems: Dispatch<SetStateAction<ComposerItem[]>>;
}) {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsMultipleSelection: true,
    mediaTypes: ["images"],
    quality: 1,
  });
  if (result.canceled) return;

  const validFiles = result.assets.filter(isAllowedFile);
  if (validFiles.length !== result.assets.length) {
    Alert.alert("Error", getFileValidationError());
  }
  setItems((current) => [...current, ...validFiles.map(createComposerItem)]);
  void Haptics.selectionAsync();
}

function createComposerItem(file: ImagePicker.ImagePickerAsset) {
  return {
    file,
    id: `${Date.now()}-${Math.random()}`,
    status: "ready" as const,
  };
}

function isAllowedFileSize(file: ImagePicker.ImagePickerAsset) {
  return (
    file.fileSize === undefined || file.fileSize <= POST_UPLOAD_MAX_SIZE_BYTES
  );
}

function isAllowedFileMetadata(file: ImagePicker.ImagePickerAsset) {
  const contentType = normalizeContentType(file.mimeType);
  if (
    file.fileName &&
    file.fileName.length > POST_UPLOAD_FILE_NAME_MAX_LENGTH
  ) {
    return false;
  }
  if (
    contentType &&
    (contentType.length > POST_UPLOAD_CONTENT_TYPE_MAX_LENGTH ||
      POST_UPLOAD_BLOCKED_CONTENT_TYPES.some((type) => type === contentType))
  ) {
    return false;
  }
  return true;
}

function normalizeContentType(contentType: string | undefined) {
  return contentType?.split(";")[0]?.trim().toLowerCase();
}

function isAllowedFile(file: ImagePicker.ImagePickerAsset) {
  return isAllowedFileSize(file) && isAllowedFileMetadata(file);
}

function getFileValidationError() {
  return `Files must be ${POST_UPLOAD_MAX_SIZE_LABEL} or smaller and must be supported photos.`;
}
