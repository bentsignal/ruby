/* eslint-disable complexity, max-lines, max-lines-per-function */
import type { ReactNode } from "react";
import type {
  GestureResponderEvent,
  PanResponderGestureState,
} from "react-native";
import { useRef, useState } from "react";
import {
  Alert,
  Image,
  PanResponder,
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
  CircleAlert,
  Clapperboard,
  GripVertical,
  ImagePlus,
  LoaderCircle,
  Play,
  Plus,
  Trash2,
  Upload,
} from "lucide-react-native";

import type { Id } from "@acme/convex/model";
import type { UIFile } from "@acme/convex/types";
import { Button, ButtonText } from "@acme/ui-mobile/button";

import { SafeAreaView } from "~/components/safe-area-view";
import { authClient } from "~/features/auth/lib/auth-client";
import { useColor } from "~/hooks/use-color";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;
const GRID_COLUMNS = 2;
const TILE_VERTICAL_GAP = 12;

type PickedFile = ImagePicker.ImagePickerAsset;
interface ComposerItem {
  id: string;
  file: PickedFile;
  status: "ready" | "uploading" | "uploaded" | "error";
  uploadedFile?: UIFile;
  error?: string;
}

interface DragState {
  itemId: string;
  startIndex: number;
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

export default function Create() {
  const convex = useConvex();
  const queryClient = useQueryClient();
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");
  const [items, setItems] = useState<ComposerItem[]>([]);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [gridWidth, setGridWidth] = useState(0);
  const [activeDragItemId, setActiveDragItemId] = useState<string | null>(null);
  const [isPosting, setIsPosting] = useState(false);
  const dragStateRef = useRef<DragState | null>(null);

  const hasUploadingItems = items.some((item) => item.status === "uploading");
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
    const validFiles = result.assets.filter(
      (file) =>
        file.fileSize === undefined || file.fileSize <= MAX_UPLOAD_SIZE_BYTES,
    );
    if (validFiles.length !== result.assets.length) {
      setError("Files must be 10 MB or smaller.");
    }
    const newItems = validFiles.map((file) => ({
      file,
      id: `${Date.now()}-${Math.random()}`,
      status: "ready" as const,
    }));
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
      if (body.size > MAX_UPLOAD_SIZE_BYTES) {
        throw new Error("Files must be 10 MB or smaller.");
      }
      const { uploadUrl } = await convex.action(createUpload, {
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
    setItems((current) => current.filter((item) => item.id !== itemId));
    void Haptics.selectionAsync();
  }

  function beginReorder(itemId: string, index: number) {
    dragStateRef.current = { itemId, startIndex: index };
    setActiveDragItemId(itemId);
    void Haptics.selectionAsync();
  }

  function updateReorder(gestureState: PanResponderGestureState) {
    const dragState = dragStateRef.current;
    if (!dragState || gridWidth <= 0) return;

    const tileWidth = gridWidth / GRID_COLUMNS;
    const tileHeight = tileWidth * 1.25 + TILE_VERTICAL_GAP;
    const startRow = Math.floor(dragState.startIndex / GRID_COLUMNS);
    const startColumn = dragState.startIndex % GRID_COLUMNS;
    const targetRow = Math.max(
      0,
      Math.round((startRow * tileHeight + gestureState.dy) / tileHeight),
    );
    const targetColumn = Math.min(
      GRID_COLUMNS - 1,
      Math.max(
        0,
        Math.round((startColumn * tileWidth + gestureState.dx) / tileWidth),
      ),
    );
    const targetIndex = Math.min(
      items.length - 1,
      targetRow * GRID_COLUMNS + targetColumn,
    );

    setItems((current) => reorderItems(current, dragState.itemId, targetIndex));
  }

  function endReorder() {
    dragStateRef.current = null;
    setActiveDragItemId(null);
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
        <CreateHeader
          canPost={canPost}
          hasUploadingItems={hasUploadingItems}
          isPosting={isPosting}
          onPost={confirmPost}
        >
          {items.length === 0 && (
            <EmptyMediaPicker foreground={foreground} onPress={pickFiles} />
          )}
        </CreateHeader>

        {items.length > 0 && (
          <View
            className="-mx-1.5 flex-row flex-wrap"
            onLayout={(event) => setGridWidth(event.nativeEvent.layout.width)}
          >
            {items.map((item, index) => (
              <MediaTile
                activeDragItemId={activeDragItemId}
                beginReorder={beginReorder}
                endReorder={endReorder}
                foreground={foreground}
                index={index}
                item={item}
                key={item.id}
                removeItem={removeItem}
                retryItem={retryItem}
                updateReorder={updateReorder}
              />
            ))}
          </View>
        )}

        <CreateFooter
          caption={caption}
          error={error}
          foreground={foreground}
          hasItems={items.length > 0}
          mutedForeground={mutedForeground}
          onAddMedia={pickFiles}
          setCaption={setCaption}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

function reorderItems(
  items: ComposerItem[],
  itemId: string,
  targetIndex: number,
) {
  const fromIndex = items.findIndex((item) => item.id === itemId);
  if (fromIndex < 0 || fromIndex === targetIndex) return items;

  const next = [...items];
  const [movedItem] = next.splice(fromIndex, 1);
  if (!movedItem) return items;

  next.splice(targetIndex, 0, movedItem);
  return next;
}

function CreateHeader({
  canPost,
  children,
  hasUploadingItems,
  isPosting,
  onPost,
}: {
  canPost: boolean;
  children: ReactNode;
  hasUploadingItems: boolean;
  isPosting: boolean;
  onPost: () => void;
}) {
  return (
    <View className="gap-5 px-2 pb-3">
      <View className="flex-row items-center justify-between gap-4">
        <Text className="text-foreground text-3xl font-black tracking-normal">
          Create
        </Text>
        <Button disabled={!canPost} size="sm" onPress={onPost}>
          {hasUploadingItems || isPosting ? (
            <LoaderCircle className="size-4" color="white" />
          ) : (
            <Upload className="size-4" color="white" />
          )}
          <ButtonText>
            {hasUploadingItems ? "Uploading" : isPosting ? "Posting" : "Post"}
          </ButtonText>
        </Button>
      </View>
      {children}
    </View>
  );
}

function CreateFooter({
  caption,
  error,
  foreground,
  hasItems,
  mutedForeground,
  onAddMedia,
  setCaption,
}: {
  caption: string;
  error: string | null;
  foreground: string;
  hasItems: boolean;
  mutedForeground: string;
  onAddMedia: () => void;
  setCaption: (caption: string) => void;
}) {
  return (
    <View className="gap-5 px-2 pt-3">
      {hasItems && (
        <Pressable
          className="border-border bg-card h-32 items-center justify-center gap-2 rounded-lg border border-dashed"
          onPress={onAddMedia}
        >
          <Plus className="size-6" color={foreground} />
          <Text className="text-muted-foreground text-sm font-semibold">
            Add more
          </Text>
        </Pressable>
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
    </View>
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
      className="bg-card border-border min-h-80 items-center justify-center gap-4 overflow-hidden rounded-lg border border-dashed p-6"
      onPress={onPress}
    >
      <View className="bg-primary/15 size-16 items-center justify-center rounded-full">
        <ImagePlus className="size-8" color={foreground} />
      </View>
      <Text className="text-foreground text-center text-base font-bold">
        Tap to add photos or videos
      </Text>
    </Pressable>
  );
}

function MediaTile({
  activeDragItemId,
  beginReorder,
  endReorder,
  foreground,
  index,
  item,
  removeItem,
  retryItem,
  updateReorder,
}: {
  activeDragItemId: string | null;
  beginReorder: (itemId: string, index: number) => void;
  endReorder: () => void;
  foreground: string;
  index: number;
  item: ComposerItem;
  removeItem: (itemId: string) => void;
  retryItem: (item: ComposerItem) => void;
  updateReorder: (gestureState: PanResponderGestureState) => void;
}) {
  const isActive = activeDragItemId === item.id;
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => beginReorder(item.id, index),
    onPanResponderMove: (
      _event: GestureResponderEvent,
      gestureState: PanResponderGestureState,
    ) => updateReorder(gestureState),
    onPanResponderRelease: endReorder,
    onPanResponderTerminate: endReorder,
    onStartShouldSetPanResponder: () => true,
  });

  return (
    <View className="w-1/2 p-1.5">
      <View
        className={`bg-card border-border aspect-[4/5] overflow-hidden rounded-lg border ${
          isActive ? "border-primary opacity-80" : ""
        }`}
      >
        <View className="size-full items-center justify-center bg-black">
          <MediaPreview foreground={foreground} item={item} />
        </View>
        <View className="absolute inset-x-0 top-0 flex-row items-center justify-between bg-black/45 p-2">
          <View
            className="h-8 flex-row items-center gap-1 rounded-full px-2"
            {...panResponder.panHandlers}
          >
            <GripVertical className="size-4" color="white" />
            <Text className="text-xs font-black text-white">{index + 1}</Text>
          </View>
          <Pressable
            className="size-8 items-center justify-center rounded-full bg-black/45"
            onPress={() => removeItem(item.id)}
          >
            <Trash2 className="size-4" color="white" />
          </Pressable>
        </View>
        <MediaStatusOverlay item={item} retryItem={retryItem} />
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
  if (item.status === "ready" || item.status === "uploaded") return null;

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
