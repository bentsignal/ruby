import { useState } from "react";
import { Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useConvex } from "convex/react";
import { makeFunctionReference } from "convex/server";

import type { UIFile } from "@acme/convex/types";
import { Button, ButtonText } from "@acme/ui-mobile/button";

import { SafeAreaView } from "~/components/safe-area-view";

type PickedFile = ImagePicker.ImagePickerAsset;

const createUpload = makeFunctionReference<
  "action",
  {
    contentType: string;
    fileName: string;
    size: number;
  },
  {
    fileId: string;
    uploadUrl: string;
  }
>("files:createUpload");

function isUploadFile(value: unknown): value is UIFile {
  if (!(value instanceof Object)) return false;
  return (
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

function getFallbackContentType(file: PickedFile) {
  return file.type === "video" ? "video/mp4" : "image/jpeg";
}

function getFallbackFileName(file: PickedFile) {
  const extension = getFallbackContentType(file).split("/")[1] ?? "bin";
  return `upload-${Date.now()}.${extension}`;
}

export default function Create() {
  const convex = useConvex();
  const [file, setFile] = useState<PickedFile | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UIFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function pickFile() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: false,
      mediaTypes: ["images", "videos"],
      quality: 1,
    });
    if (result.canceled) return;
    setFile(result.assets[0] ?? null);
    setUploadedFile(null);
    setError(null);
  }

  async function uploadFile() {
    if (!file) return;

    setIsUploading(true);
    setUploadedFile(null);
    setError(null);

    try {
      const contentType = file.mimeType ?? getFallbackContentType(file);
      const fileName = file.fileName ?? getFallbackFileName(file);
      const fileResponse = await fetch(file.uri);
      const body = await fileResponse.blob();
      const { uploadUrl } = await convex.action(createUpload, {
        contentType,
        fileName,
        size: file.fileSize ?? body.size,
      });
      const uploadResponse = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": contentType,
        },
        body,
      });
      const result = getUploadResult(await uploadResponse.json());
      if (!uploadResponse.ok || "error" in result) {
        throw new Error("error" in result ? result.error : "Upload failed");
      }
      setUploadedFile(result.file);
      setIsUploading(false);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Upload failed";
      setError(message);
      setIsUploading(false);
    }
  }

  return (
    <SafeAreaView>
      <View className="flex-1 gap-4 p-4">
        <Text className="text-foreground text-2xl font-bold">Create</Text>
        <View className="bg-card border-border gap-4 rounded-lg border p-4">
          <Button onPress={pickFile}>
            <ButtonText>
              {file ? "Choose another photo or video" : "Choose photo or video"}
            </ButtonText>
          </Button>
          {file && (
            <Text className="text-muted-foreground text-sm">
              {file.fileName ?? "Selected media"}
            </Text>
          )}
          <Button disabled={!file || isUploading} onPress={uploadFile}>
            <ButtonText>
              {isUploading ? "Uploading..." : "Upload test file"}
            </ButtonText>
          </Button>
          {error && <Text className="text-destructive text-sm">{error}</Text>}
          {uploadedFile && (
            <View className="gap-1">
              <Text className="text-foreground text-sm font-semibold">
                Uploaded {uploadedFile.mediaType}
              </Text>
              <Text className="text-primary text-sm">{uploadedFile.url}</Text>
              <Text className="text-muted-foreground text-sm">
                {uploadedFile.contentType}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
