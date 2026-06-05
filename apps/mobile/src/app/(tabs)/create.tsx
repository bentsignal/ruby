/* eslint-disable complexity, max-lines, max-lines-per-function */
import { useState } from "react";
import {
  Alert,
  Image,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import * as Haptics from "expo-haptics";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useConvex } from "convex/react";
import { makeFunctionReference } from "convex/server";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Clapperboard,
  ImagePlus,
  LoaderCircle,
  Play,
  Plus,
  Trash2,
} from "lucide-react-native";

import type { Id } from "@acme/convex/model";
import type { UIFile } from "@acme/convex/types";
import { Button, ButtonText } from "@acme/ui-mobile/button";

import { SafeAreaView } from "~/components/safe-area-view";
import { useColor } from "~/hooks/use-color";

type PickedFile = ImagePicker.ImagePickerAsset;
interface ComposerItem {
  id: string;
  file: PickedFile;
  status: "ready" | "uploading" | "uploaded" | "error";
  uploadedFile?: UIFile;
  error?: string;
}

const createUpload = makeFunctionReference<
  "action",
  {
    contentType: string;
    fileName: string;
    size: number;
  },
  {
    fileId: Id<"files">;
    uploadUrl: string;
  }
>("files:createUpload");

const createPost = makeFunctionReference<
  "mutation",
  {
    caption?: string;
    fileIds: Id<"files">[];
  },
  Id<"posts">
>("posts:create");

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

function getFallbackContentType(file: PickedFile) {
  return file.type === "video" ? "video/mp4" : "image/jpeg";
}

function getFallbackFileName(file: PickedFile) {
  const extension = getFallbackContentType(file).split("/")[1] ?? "bin";
  return `upload-${Date.now()}.${extension}`;
}

export default function Create() {
  const convex = useConvex();
  const queryClient = useQueryClient();
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");
  const [items, setItems] = useState<ComposerItem[]>([]);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const hasUploadingItems = items.some((item) => item.status === "uploading");
  const failedItemsCount = items.filter(
    (item) => item.status === "error",
  ).length;
  const selectedItem =
    items.find((item) => item.id === selectedItemId) ?? items[0] ?? null;
  const selectedItemIndex = selectedItem
    ? items.findIndex((item) => item.id === selectedItem.id)
    : -1;
  const canPost =
    !isPosting &&
    !hasUploadingItems &&
    (items.length > 0 || caption.trim().length > 0);

  async function pickFiles() {
    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ["images", "videos"],
      quality: 1,
    });
    if (result.canceled) return;

    setError(null);
    const newItems = result.assets.map((file) => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: "ready" as const,
    }));
    setSelectedItemId((current) => current ?? newItems[0]?.id ?? null);
    setItems((current) => [...current, ...newItems]);
    void Haptics.selectionAsync();
  }

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
      const contentType =
        item.file.mimeType ?? getFallbackContentType(item.file);
      const fileName = item.file.fileName ?? getFallbackFileName(item.file);
      const fileResponse = await fetch(item.file.uri);
      const body = await fileResponse.blob();
      const { uploadUrl } = await convex.action(createUpload, {
        contentType,
        fileName,
        size: item.file.fileSize ?? body.size,
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
      updateItem(item.id, { status: "uploaded", uploadedFile: result.file });
      return result.file;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Upload failed";
      updateItem(item.id, { error: message, status: "error" });
      throw new Error(message);
    }
  }

  function updateItem(itemId: string, patch: Partial<ComposerItem>) {
    setItems((current) =>
      current.map((item) =>
        item.id === itemId ? { ...item, ...patch } : item,
      ),
    );
  }

  function removeItem(itemId: string) {
    setItems((current) => {
      const next = current.filter((item) => item.id !== itemId);
      if (selectedItemId === itemId) {
        setSelectedItemId(next[0]?.id ?? null);
      }
      return next;
    });
    void Haptics.selectionAsync();
  }

  function moveItem(itemId: string, direction: -1 | 1) {
    setItems((current) => {
      const fromIndex = current.findIndex((item) => item.id === itemId);
      const toIndex = fromIndex + direction;
      if (fromIndex < 0 || toIndex < 0 || toIndex >= current.length) {
        return current;
      }
      const next = [...current];
      const [movedItem] = next.splice(fromIndex, 1);
      if (!movedItem) return current;
      next.splice(toIndex, 0, movedItem);
      return next;
    });
    void Haptics.selectionAsync();
  }

  function retryItem(item: ComposerItem) {
    updateItem(item.id, { error: undefined, status: "ready" });
  }

  async function publishPost() {
    setIsPosting(true);
    setError(null);
    try {
      const uploadedFiles = await Promise.all(items.map(uploadItem));
      await convex.mutation(createPost, {
        caption: caption.trim() || undefined,
        fileIds: uploadedFiles.map((file) => file._id),
      });
      await queryClient.invalidateQueries({ queryKey: ["posts"] });
      setIsPosting(false);
      router.replace("/");
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Post failed";
      setError(message);
      setIsPosting(false);
    }
  }

  function confirmPost() {
    Alert.alert("Post this update?", "It will appear on home and profile.", [
      { style: "cancel", text: "Cancel" },
      { onPress: () => void publishPost(), text: "Post" },
    ]);
  }

  return (
    <SafeAreaView className="bg-background flex-1">
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-5 px-4 pt-4 pb-32"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-start justify-between gap-4">
          <View className="flex-1">
            <Text className="text-foreground text-3xl font-black tracking-normal">
              Create
            </Text>
            <Text className="text-muted-foreground mt-1 text-sm">
              Shape the order, add context, then post.
            </Text>
          </View>
          {items.length > 0 && (
            <Pressable
              className="bg-card border-border h-11 flex-row items-center gap-2 rounded-full border px-4"
              onPress={pickFiles}
            >
              <Plus className="size-4" color={foreground} />
              <Text className="text-foreground text-sm font-bold">Add</Text>
            </Pressable>
          )}
        </View>

        {items.length === 0 ? (
          <EmptyMediaPicker foreground={foreground} onPress={pickFiles} />
        ) : (
          <View className="gap-4">
            {selectedItem && (
              <FocusedPreview
                foreground={foreground}
                item={selectedItem}
                itemCount={items.length}
                itemIndex={selectedItemIndex}
                moveItem={moveItem}
                removeItem={removeItem}
                retryItem={retryItem}
              />
            )}

            <ScrollView
              horizontal
              contentContainerClassName="gap-3 pr-2"
              showsHorizontalScrollIndicator={false}
            >
              {items.map((item, index) => (
                <MediaThumb
                  foreground={foreground}
                  index={index}
                  isSelected={item.id === selectedItem?.id}
                  item={item}
                  key={item.id}
                  onPress={() => setSelectedItemId(item.id)}
                />
              ))}
              <Pressable
                className="border-border bg-card h-24 w-20 items-center justify-center rounded-lg border border-dashed"
                onPress={pickFiles}
              >
                <Plus className="size-5" color={foreground} />
              </Pressable>
            </ScrollView>

            <UploadSummary
              failedCount={failedItemsCount}
              totalCount={items.length}
            />
          </View>
        )}

        <View className="gap-2">
          <Text className="text-foreground text-sm font-bold">Caption</Text>
          <TextInput
            className="bg-card border-border text-foreground min-h-40 rounded-lg border p-4 text-base leading-6"
            maxLength={2200}
            multiline
            placeholder="Tell the story behind this stop."
            placeholderTextColor={mutedForeground}
            textAlignVertical="top"
            value={caption}
            onChangeText={setCaption}
          />
          <Text className="text-muted-foreground self-end text-xs">
            {caption.length}/2200
          </Text>
        </View>

        {error && <Text className="text-destructive text-sm">{error}</Text>}
      </ScrollView>

      <View className="bg-background/95 border-border absolute inset-x-0 bottom-0 gap-3 border-t p-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-muted-foreground text-xs">
            {items.length} media | {caption.trim().length} chars
          </Text>
          {hasUploadingItems && (
            <Text className="text-muted-foreground text-xs">
              Uploading media
            </Text>
          )}
        </View>
        <Button disabled={!canPost} onPress={confirmPost}>
          <ButtonText>
            {hasUploadingItems
              ? "Uploading..."
              : isPosting
                ? "Posting..."
                : "Post"}
          </ButtonText>
        </Button>
      </View>
    </SafeAreaView>
  );
}

function EmptyMediaPicker({
  foreground,
  onPress,
}: {
  foreground: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="bg-card border-border min-h-80 justify-between overflow-hidden rounded-lg border"
      onPress={onPress}
    >
      <View className="h-44 items-center justify-center bg-black/20">
        <View className="bg-primary/15 size-16 items-center justify-center rounded-full">
          <ImagePlus className="size-8" color={foreground} />
        </View>
      </View>
      <View className="gap-2 p-5">
        <Text className="text-foreground text-xl font-black">
          Start with photos or videos
        </Text>
        <Text className="text-muted-foreground text-sm leading-5">
          Pick a batch from your library. You can add more, remove, and tune the
          order before posting.
        </Text>
      </View>
    </Pressable>
  );
}

function FocusedPreview({
  foreground,
  item,
  itemCount,
  itemIndex,
  moveItem,
  removeItem,
  retryItem,
}: {
  foreground: string;
  item: ComposerItem;
  itemCount: number;
  itemIndex: number;
  moveItem: (itemId: string, direction: -1 | 1) => void;
  removeItem: (itemId: string) => void;
  retryItem: (item: ComposerItem) => void;
}) {
  return (
    <View className="bg-card border-border overflow-hidden rounded-lg border">
      <View className="h-96 items-center justify-center bg-black">
        <MediaPreview foreground={foreground} item={item} />
        <MediaStatusOverlay item={item} retryItem={retryItem} />
        <View className="absolute top-3 left-3 rounded-full bg-black/60 px-3 py-1">
          <Text className="text-xs font-bold text-white">
            {itemIndex + 1} of {itemCount}
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-2 p-3">
        <Button
          className="flex-1"
          variant="outline"
          disabled={itemIndex === 0}
          onPress={() => moveItem(item.id, -1)}
        >
          <ArrowLeft className="size-4" color={foreground} />
          <ButtonText variant="outline">Earlier</ButtonText>
        </Button>
        <Button
          className="flex-1"
          variant="outline"
          disabled={itemIndex === itemCount - 1}
          onPress={() => moveItem(item.id, 1)}
        >
          <ButtonText variant="outline">Later</ButtonText>
          <ArrowRight className="size-4" color={foreground} />
        </Button>
        <Button
          variant="outline"
          size="icon"
          onPress={() => removeItem(item.id)}
        >
          <Trash2 className="size-4" color={foreground} />
        </Button>
      </View>
    </View>
  );
}

function MediaPreview({
  foreground,
  item,
}: {
  foreground: string;
  item: ComposerItem;
}) {
  if (item.file.type === "video") {
    return (
      <View className="items-center gap-3 px-8">
        <View className="size-16 items-center justify-center rounded-full bg-white/10">
          <Play className="size-9" color="white" />
        </View>
        <Text className="text-center text-sm font-semibold text-white">
          {item.file.fileName ?? "Video selected"}
        </Text>
        <Clapperboard className="size-5" color={foreground} />
      </View>
    );
  }

  return (
    <Image
      className="size-full"
      resizeMode="cover"
      source={{ uri: item.file.uri }}
    />
  );
}

function MediaStatusOverlay({
  item,
  retryItem,
}: {
  item: ComposerItem;
  retryItem: (item: ComposerItem) => void;
}) {
  if (item.status === "ready") return null;

  if (item.status === "uploaded") {
    return (
      <View className="absolute top-3 right-3 flex-row items-center gap-1 rounded-full bg-black/60 px-3 py-1">
        <CheckCircle2 className="size-3.5" color="white" />
        <Text className="text-xs font-bold text-white">Ready</Text>
      </View>
    );
  }

  return (
    <View className="absolute inset-0 items-center justify-center bg-black/55 px-6">
      {item.status === "uploading" ? (
        <View className="items-center gap-3">
          <LoaderCircle className="size-7" color="white" />
          <Text className="text-sm font-bold text-white">Uploading</Text>
        </View>
      ) : (
        <Pressable
          className="items-center gap-3"
          onPress={() => retryItem(item)}
        >
          <CircleAlert className="size-7" color="white" />
          <Text className="text-center text-sm font-bold text-white">
            {item.error ?? "Upload failed"}
          </Text>
          <Text className="text-xs font-semibold text-white/80">
            Tap to retry
          </Text>
        </Pressable>
      )}
    </View>
  );
}

function MediaThumb({
  foreground,
  index,
  isSelected,
  item,
  onPress,
}: {
  foreground: string;
  index: number;
  isSelected: boolean;
  item: ComposerItem;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={`border-border h-24 w-20 overflow-hidden rounded-lg border ${
        isSelected ? "border-primary" : ""
      }`}
      onPress={onPress}
    >
      {item.file.type === "video" ? (
        <View className="bg-card size-full items-center justify-center">
          <Play className="size-5" color={foreground} />
        </View>
      ) : (
        <Image
          className="size-full"
          resizeMode="cover"
          source={{ uri: item.file.uri }}
        />
      )}
      <View className="absolute top-1 left-1 rounded-full bg-black/65 px-2 py-0.5">
        <Text className="text-[10px] font-black text-white">{index + 1}</Text>
      </View>
      {(item.status === "uploading" || item.status === "error") && (
        <View className="absolute inset-0 items-center justify-center bg-black/45">
          {item.status === "uploading" ? (
            <LoaderCircle className="size-4" color="white" />
          ) : (
            <CircleAlert className="size-4" color="white" />
          )}
        </View>
      )}
    </Pressable>
  );
}

function UploadSummary({
  failedCount,
  totalCount,
}: {
  failedCount: number;
  totalCount: number;
}) {
  return (
    <View className="bg-card border-border flex-row items-center justify-between rounded-lg border px-4 py-3">
      <Text className="text-foreground text-sm font-bold">
        {totalCount} selected
      </Text>
      <Text
        className={
          failedCount > 0
            ? "text-destructive text-sm font-semibold"
            : "text-muted-foreground text-sm"
        }
      >
        {failedCount > 0
          ? `${failedCount} need retry`
          : "Uploads when you post"}
      </Text>
    </View>
  );
}
