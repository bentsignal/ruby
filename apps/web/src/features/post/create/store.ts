import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { createStore } from "rostra";

import type { ResolvedLocation } from "@acme/convex/places/types";
import { api } from "@acme/convex/api";
import { getDisplayErrorMessage } from "@acme/std/display-error";
import { toast } from "@acme/ui-web/toast";

import { useComposerItems } from "./hooks/use-composer-items";
import { uploadComposerFile } from "./lib/composer-upload";

function useInternalStore() {
  const createUpload = useConvexMutation(api.files.mutations.createUpload);
  const createPost = useConvexMutation(api.posts.mutations.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [location, setLocation] = useState<ResolvedLocation | null>(null);
  const {
    addFiles,
    items,
    moveItem,
    removeItem,
    revokeItemPreviewUrls,
    updateItem,
  } = useComposerItems();

  const hasUploadingItems = items.some((item) => item.status === "uploading");
  const hasPostContent = items.length > 0 || caption.trim().length > 0;
  const canPost = !isPosting && !hasUploadingItems && hasPostContent;

  async function uploadItem(item: (typeof items)[number]) {
    updateItem(item.id, { error: undefined, status: "uploading" });
    try {
      const file = await uploadComposerFile({
        createUpload,
        file: item.file,
      });
      updateItem(item.id, { status: "uploaded" });
      return file;
    } catch (caughtError) {
      const message = getDisplayErrorMessage(caughtError, "Upload failed");
      updateItem(item.id, { error: message, status: "error" });
      throw new Error(message);
    }
  }

  async function publishPost() {
    setIsPosting(true);
    try {
      const uploadedFiles = await Promise.all(items.map(uploadItem));
      await createPost({
        caption: caption.trim() || undefined,
        fileIds: uploadedFiles.map((file) => file._id),
        location: createPostLocation(location),
      });
      await queryClient.invalidateQueries({
        queryKey: convexQuery(api.posts.queries.getAll, {}).queryKey,
      });
      revokeItemPreviewUrls(items);
      setLocation(null);
      setIsConfirmOpen(false);
      setIsPosting(false);
      await navigate({ to: "/" });
    } catch (caughtError) {
      toast.error(getDisplayErrorMessage(caughtError, "Post failed"), {
        position: "top-center",
      });
      setIsConfirmOpen(false);
      setIsPosting(false);
    }
  }

  return {
    addFiles,
    canPost,
    caption,
    hasUploadingItems,
    inputRef,
    isConfirmOpen,
    isPosting,
    items,
    location,
    moveItem,
    openConfirm: () => setIsConfirmOpen(true),
    publishPost,
    removeItem,
    clearLocation: () => setLocation(null),
    setCaption,
    setIsConfirmOpen,
    setLocation,
  };
}

function createPostLocation(location: ResolvedLocation | null) {
  if (!location) return undefined;

  return {
    googlePlaceId: location.googlePlaceId,
    name: location.name,
    provider: location.provider,
    ...(location.formattedAddress
      ? { formattedAddress: location.formattedAddress }
      : {}),
    ...(location.latitude === undefined ? {} : { latitude: location.latitude }),
    ...(location.longitude === undefined
      ? {}
      : { longitude: location.longitude }),
  };
}

export const { Store: CreateStore, useStore: useCreateStore } =
  createStore(useInternalStore);

export function useComposerItem(itemId: string) {
  return useCreateStore((store) =>
    store.items.find((item) => item.id === itemId),
  );
}
