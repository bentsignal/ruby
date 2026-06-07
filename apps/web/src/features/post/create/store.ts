import { useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { convexQuery, useConvexMutation } from "@convex-dev/react-query";
import { createStore } from "rostra";

import { api } from "@acme/convex/api";

import { useComposerItems } from "./hooks/use-composer-items";
import { uploadComposerFile } from "./lib/composer-upload";

function useInternalStore() {
  const createUpload = useConvexMutation(api.files.createUpload);
  const createPost = useConvexMutation(api.posts.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [caption, setCaption] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const {
    addFiles,
    items,
    moveItem,
    removeItem,
    revokeItemPreviewUrls,
    updateItem,
  } = useComposerItems({ setError });

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
      const message = getErrorMessage(caughtError, "Upload failed");
      updateItem(item.id, { error: message, status: "error" });
      throw new Error(message);
    }
  }

  async function publishPost() {
    setIsPosting(true);
    setError(null);
    try {
      const uploadedFiles = await Promise.all(items.map(uploadItem));
      await createPost({
        caption: caption.trim() || undefined,
        fileIds: uploadedFiles.map((file) => file._id),
      });
      await queryClient.invalidateQueries({
        queryKey: convexQuery(api.posts.getAll, {}).queryKey,
      });
      revokeItemPreviewUrls(items);
      setIsConfirmOpen(false);
      setIsPosting(false);
      await navigate({ to: "/" });
    } catch (caughtError) {
      setError(getErrorMessage(caughtError, "Post failed"));
      setIsConfirmOpen(false);
      setIsPosting(false);
    }
  }

  return {
    addFiles,
    canPost,
    caption,
    error,
    hasUploadingItems,
    inputRef,
    isConfirmOpen,
    isPosting,
    items,
    moveItem,
    openConfirm: () => setIsConfirmOpen(true),
    publishPost,
    removeItem,
    setCaption,
    setIsConfirmOpen,
  };
}

function getErrorMessage(error: unknown, fallback: string) {
  if (error instanceof Error) return error.message;
  return fallback;
}

export const { Store: CreateStore, useStore: useCreateStore } =
  createStore(useInternalStore);
