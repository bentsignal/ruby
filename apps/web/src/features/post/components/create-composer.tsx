/* eslint-disable max-lines, max-lines-per-function */
import type { DragEndEvent } from "@dnd-kit/core";
import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useConvex } from "convex/react";
import { makeFunctionReference } from "convex/server";
import {
  GripVertical,
  ImagePlus,
  LoaderCircle,
  Plus,
  Trash2,
  Upload,
  UploadIcon,
  X,
} from "lucide-react";

import type { Id } from "@acme/convex/model";
import type { UIFile } from "@acme/convex/types";
import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-web/button";
import * as Dialog from "@acme/ui-web/dialog";
import * as Tooltip from "@acme/ui-web/tooltip";

import { authClient } from "~/features/auth/lib/client";

const MAX_UPLOAD_SIZE_BYTES = 10 * 1024 * 1024;

const createUpload = makeFunctionReference<
  "action",
  { contentType: string; fileName: string; size: number },
  { fileId: Id<"files">; uploadUrl: string }
>("files:createUpload");

const createPost = makeFunctionReference<
  "mutation",
  { caption?: string; fileIds: Id<"files">[] },
  Id<"posts">
>("posts:create");

interface ComposerItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "ready" | "uploading" | "uploaded" | "error";
  error?: string;
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
  if ("file" in value && isUploadFile(value.file)) return { file: value.file };
  return { error: "Upload failed" };
}

function isMediaFile(file: File) {
  return file.type.startsWith("image/") || file.type.startsWith("video/");
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

export function CreateComposer() {
  const convex = useConvex();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const previewUrlsRef = useRef(new Set<string>());
  const [items, setItems] = useState<ComposerItem[]>([]);
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  const hasUploadingItems = items.some((item) => item.status === "uploading");
  const canPost =
    !isPosting &&
    !hasUploadingItems &&
    (items.length > 0 || caption.trim().length > 0);

  function addFiles(fileList: FileList | File[]) {
    const files = Array.from(fileList);
    const mediaFiles = files.filter(isMediaFile);
    const validFiles = mediaFiles.filter(
      (file) => file.size <= MAX_UPLOAD_SIZE_BYTES,
    );
    setError(
      mediaFiles.length !== files.length
        ? "Only photos and videos can be added to a post."
        : validFiles.length === mediaFiles.length
          ? null
          : "Files must be 10 MB or smaller.",
    );
    const newItems = validFiles.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      previewUrlsRef.current.add(previewUrl);
      return {
        file,
        id: crypto.randomUUID(),
        previewUrl,
        status: "ready" as const,
      };
    });
    setItems((current) => [...current, ...newItems]);
  }

  async function uploadItem(item: ComposerItem) {
    updateItem(item.id, { error: undefined, status: "uploading" });
    try {
      const contentType = item.file.type || "application/octet-stream";
      const { uploadUrl } = await convex.action(createUpload, {
        contentType,
        fileName: item.file.name,
        size: item.file.size,
      });
      const response = await fetch(uploadUrl, {
        body: item.file,
        headers: await getUploadHeaders(contentType),
        method: "POST",
      });
      const result = getUploadResult(await response.json());
      if (!response.ok || "error" in result) {
        throw new Error("error" in result ? result.error : "Upload failed");
      }
      updateItem(item.id, { status: "uploaded" });
      return result.file;
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Upload failed";
      updateItem(item.id, {
        error: message,
        status: "error",
      });
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
      const item = current.find((currentItem) => currentItem.id === itemId);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
        previewUrlsRef.current.delete(item.previewUrl);
      }
      return current.filter((currentItem) => currentItem.id !== itemId);
    });
  }

  function moveItem(activeId: string, overId: string) {
    setItems((current) => reorderItems(current, activeId, overId));
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
      for (const item of items) {
        URL.revokeObjectURL(item.previewUrl);
        previewUrlsRef.current.delete(item.previewUrl);
      }
      setIsConfirmOpen(false);
      setIsPosting(false);
      await navigate({ to: "/" });
    } catch (caughtError) {
      setError(
        caughtError instanceof Error ? caughtError.message : "Post failed",
      );
      setIsConfirmOpen(false);
      setIsPosting(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 pt-6 pb-28 sm:px-6 sm:pt-10">
      <ComposerHeader canPost={canPost} onPost={() => setIsConfirmOpen(true)} />
      <FileInput inputRef={inputRef} onFiles={addFiles} />
      {items.length === 0 && (
        <Dropzone inputRef={inputRef} onFiles={addFiles} />
      )}
      <MediaGrid
        inputRef={inputRef}
        items={items}
        moveItem={moveItem}
        removeItem={removeItem}
      />
      <CaptionField caption={caption} setCaption={setCaption} />
      {error && <p className="text-destructive text-sm">{error}</p>}
      <MobilePostBar
        canPost={canPost}
        isUploading={hasUploadingItems}
        onPost={() => setIsConfirmOpen(true)}
      />
      <ConfirmDialog
        isOpen={isConfirmOpen}
        isPosting={isPosting}
        onOpenChange={setIsConfirmOpen}
        onPost={publishPost}
      />
    </div>
  );
}

function reorderItems(items: ComposerItem[], activeId: string, overId: string) {
  if (activeId === overId) return items;
  const fromIndex = items.findIndex((item) => item.id === activeId);
  const toIndex = items.findIndex((item) => item.id === overId);
  if (fromIndex < 0 || toIndex < 0) return items;
  return arrayMove(items, fromIndex, toIndex);
}

function ComposerHeader({
  canPost,
  onPost,
}: {
  canPost: boolean;
  onPost: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Create a new post
        </h1>
      </div>
      <Button
        className="hidden sm:inline-flex"
        disabled={!canPost}
        onClick={onPost}
      >
        <UploadIcon className="size-4" />
        Post
      </Button>
    </div>
  );
}

function FileInput({
  inputRef,
  onFiles,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFiles: (files: FileList) => void;
}) {
  return (
    <input
      ref={inputRef}
      className="sr-only"
      type="file"
      accept="image/*,video/*"
      multiple
      onChange={(event) => {
        if (event.target.files) onFiles(event.target.files);
        event.target.value = "";
      }}
    />
  );
}

function Dropzone({
  inputRef,
  onFiles,
}: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  onFiles: (files: FileList) => void;
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  return (
    <button
      type="button"
      className={cn(
        "border-border bg-card hover:bg-accent/60 flex min-h-52 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center transition-colors",
        isDraggingOver && "border-primary bg-primary/10",
      )}
      onClick={() => inputRef.current?.click()}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDraggingOver(true);
      }}
      onDragLeave={() => setIsDraggingOver(false)}
      onDrop={(event) => {
        event.preventDefault();
        setIsDraggingOver(false);
        onFiles(event.dataTransfer.files);
      }}
    >
      <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
        <ImagePlus className="size-6" />
      </span>
      <span className="text-foreground text-base font-semibold">
        Click to upload, or drop files here
      </span>
    </button>
  );
}

function MediaGrid(props: {
  inputRef: React.RefObject<HTMLInputElement | null>;
  items: ComposerItem[];
  moveItem: (itemId: string, targetId: string) => void;
  removeItem: (itemId: string) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      props.moveItem(String(active.id), String(over.id));
    }
  }

  if (props.items.length === 0) return null;
  return (
    <DndContext
      collisionDetection={closestCenter}
      sensors={sensors}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={props.items.map((item) => item.id)}
        strategy={rectSortingStrategy}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {props.items.map((item, index) => (
            <PreviewTile
              index={index}
              item={item}
              key={item.id}
              removeItem={props.removeItem}
            />
          ))}
          <button
            type="button"
            className="border-border text-muted-foreground hover:bg-accent hover:text-foreground flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors"
            onClick={() => props.inputRef.current?.click()}
          >
            <Plus className="size-6" />
            <span className="text-sm font-semibold">Add more</span>
          </button>
        </div>
      </SortableContext>
    </DndContext>
  );
}

function PreviewTile({
  index,
  item,
  removeItem,
}: {
  index: number;
  item: ComposerItem;
  removeItem: (itemId: string) => void;
}) {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: item.id });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-border bg-card relative aspect-[4/5] overflow-hidden rounded-lg border",
        isDragging && "z-10 opacity-70",
      )}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      {item.file.type.startsWith("video/") ? (
        <video
          className="size-full object-cover"
          src={item.previewUrl}
          controls
          muted
          playsInline
        />
      ) : (
        <div
          className="size-full bg-cover bg-center"
          style={{ backgroundImage: `url(${item.previewUrl})` }}
        />
      )}
      <PreviewToolbar
        attributes={attributes}
        index={index}
        itemId={item.id}
        listeners={listeners}
        removeItem={removeItem}
      />
      {(item.status === "uploading" || item.status === "error") && (
        <UploadState item={item} />
      )}
    </div>
  );
}

function PreviewToolbar({
  attributes,
  index,
  itemId,
  listeners,
  removeItem,
}: {
  attributes: React.HTMLAttributes<HTMLElement>;
  index: number;
  itemId: string;
  listeners?: React.HTMLAttributes<HTMLElement>;
  removeItem: (itemId: string) => void;
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  return (
    <div className="absolute inset-x-0 top-0 flex items-center justify-between bg-black/45 p-2 text-white">
      <button
        type="button"
        className="flex cursor-grab touch-none items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold active:cursor-grabbing"
        aria-label="Drag media"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="size-4" />
        {index + 1}
      </button>
      {isConfirming ? (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold">Remove?</span>
          <Tooltip.Container>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full bg-black/35 transition-colors hover:bg-black/60"
                aria-label="Cancel remove"
                onClick={() => setIsConfirming(false)}
              >
                <X className="size-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>Cancel</Tooltip.Content>
          </Tooltip.Container>
          <Tooltip.Container>
            <Tooltip.Trigger asChild>
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-full bg-red-500 transition-colors hover:bg-red-600"
                aria-label="Remove media"
                onClick={() => removeItem(itemId)}
              >
                <Trash2 className="size-4" />
              </button>
            </Tooltip.Trigger>
            <Tooltip.Content>Remove media</Tooltip.Content>
          </Tooltip.Container>
        </div>
      ) : (
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-full bg-black/35 transition-colors hover:bg-black/60"
          aria-label="Remove media"
          onClick={() => setIsConfirming(true)}
        >
          <Trash2 className="size-4" />
        </button>
      )}
    </div>
  );
}

function UploadState({ item }: { item: ComposerItem }) {
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/50 p-4 text-center text-sm font-semibold text-white">
      {item.status === "uploading" ? (
        <span className="flex items-center gap-2">
          <LoaderCircle className="size-4 animate-spin" />
          Uploading
        </span>
      ) : (
        (item.error ?? "Upload failed")
      )}
    </div>
  );
}

function CaptionField({
  caption,
  setCaption,
}: {
  caption: string;
  setCaption: (caption: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold">Caption</span>
      <textarea
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-36 w-full resize-none rounded-lg border px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        maxLength={2200}
        placeholder="Tell the story behind this stop..."
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <span className="text-muted-foreground self-end text-xs">
        {caption.length}/2200
      </span>
    </label>
  );
}

function MobilePostBar(props: {
  canPost: boolean;
  isUploading: boolean;
  onPost: () => void;
}) {
  return (
    <div className="bg-background/90 fixed inset-x-0 bottom-0 border-t p-4 backdrop-blur sm:hidden">
      <Button
        className="w-full"
        disabled={!props.canPost}
        onClick={props.onPost}
      >
        {props.isUploading ? "Uploading..." : "Post"}
      </Button>
    </div>
  );
}

function ConfirmDialog(props: {
  isOpen: boolean;
  isPosting: boolean;
  onOpenChange: (open: boolean) => void;
  onPost: () => void;
}) {
  return (
    <Dialog.Container open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Post this update?</Dialog.Title>
          <Dialog.Description>
            Your media and caption will show on the home feed and your profile.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button
            variant="outline"
            disabled={props.isPosting}
            onClick={() => props.onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button disabled={props.isPosting} onClick={props.onPost}>
            {props.isPosting ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Posting
              </>
            ) : (
              <>
                <Upload className="size-4" />
                Post
              </>
            )}
          </Button>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
}
