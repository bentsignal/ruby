import { useEffect, useRef, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useConvexMutation } from "@convex-dev/react-query";
import { createStore } from "rostra";

import type { PostDisplayAspectRatio } from "@acme/config/posts";
import type { ResolvedLocation } from "@acme/convex/places/types";
import {
  DEFAULT_POST_DISPLAY_ASPECT_RATIO,
  getClosestPostDisplayAspectRatio,
} from "@acme/config/posts";
import { api } from "@acme/convex/api";
import { getDisplayErrorMessage } from "@acme/std/display-error";
import { toast } from "@acme/ui-web/toast";

import type { ComposerItem } from "./types";
import { useComposerItems } from "./hooks/use-composer-items";
import { uploadComposerFile } from "./lib/composer-upload";

const LOCATION_REVEAL_DELAY_MS = 100;

function useInternalStore() {
  const createUpload = useConvexMutation(api.files.mutations.createUpload);
  const createPost = useConvexMutation(api.posts.mutations.create);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [caption, setCaption] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [location, setLocation] = useState<ResolvedLocation | null>(null);
  const locationResolve = useLocationResolveState({ setLocation });
  const {
    addFiles,
    items,
    moveItem,
    removeItem,
    revokeItemPreviewUrls,
    updateItem,
  } = useComposerItems();
  const displayAspectRatioState = useDisplayAspectRatioState(items);

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
        attachments: uploadedFiles.map((file) => file._id),
        caption: caption.trim() || undefined,
        displayAspectRatio: uploadedFiles.some(
          (file) => file.mediaType === "image",
        )
          ? displayAspectRatioState.displayAspectRatio
          : undefined,
        location: createPostLocation(location),
      });
      revokeItemPreviewUrls(items);
      locationResolve.clearLocation();
      setIsConfirmOpen(false);
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
    displayAspectRatio: displayAspectRatioState.displayAspectRatio,
    hasImageItems: displayAspectRatioState.hasImageItems,
    hasUploadingItems,
    inputRef,
    isConfirmOpen,
    isLocationResolving: locationResolve.isLocationResolving,
    isPreviewOpen,
    isPosting,
    items,
    location,
    moveItem,
    openConfirm: () => setIsConfirmOpen(true),
    publishPost,
    removeItem,
    clearLocation: locationResolve.clearLocation,
    finishLocationResolve: locationResolve.finishLocationResolve,
    setCaption,
    setDisplayAspectRatio: displayAspectRatioState.setDisplayAspectRatio,
    setIsConfirmOpen,
    setIsPreviewOpen,
    setLocation: locationResolve.setLocation,
    startLocationResolve: locationResolve.startLocationResolve,
  };
}

function isImageItem(item: ComposerItem) {
  return item.file.type.startsWith("image/");
}

function useDisplayAspectRatioState(items: ComposerItem[]) {
  const [displayAspectRatio, setDisplayAspectRatioState] =
    useState<PostDisplayAspectRatio>(DEFAULT_POST_DISPLAY_ASPECT_RATIO);
  const [hasSelectedDisplayAspectRatio, setHasSelectedDisplayAspectRatio] =
    useState(false);
  const hasImageItems = items.some((item) => isImageItem(item));
  const firstImagePreviewUrl = items.find(isImageItem)?.previewUrl;

  // eslint-disable-next-line no-restricted-syntax -- Reads selected image dimensions to seed the default post shape.
  useEffect(() => {
    if (hasSelectedDisplayAspectRatio || !firstImagePreviewUrl) return;

    let active = true;
    const image = new Image();
    image.onload = () => {
      if (!active) return;
      setDisplayAspectRatioState(
        getClosestPostDisplayAspectRatio({
          height: image.naturalHeight,
          width: image.naturalWidth,
        }),
      );
    };
    image.src = firstImagePreviewUrl;

    return () => {
      active = false;
    };
  }, [firstImagePreviewUrl, hasSelectedDisplayAspectRatio]);

  return {
    displayAspectRatio,
    hasImageItems,
    setDisplayAspectRatio: (ratio: PostDisplayAspectRatio) => {
      setHasSelectedDisplayAspectRatio(true);
      setDisplayAspectRatioState(ratio);
    },
  };
}

function useLocationResolveState({
  setLocation,
}: {
  setLocation: (location: ResolvedLocation | null) => void;
}) {
  const [isLocationResolving, setIsLocationResolving] = useState(false);
  const locationRevealTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  function clearLocationRevealTimeout() {
    if (!locationRevealTimeoutRef.current) return;
    clearTimeout(locationRevealTimeoutRef.current);
    locationRevealTimeoutRef.current = null;
  }

  // eslint-disable-next-line no-restricted-syntax -- Clears a pending delayed location reveal when the composer unmounts.
  useEffect(() => {
    return clearLocationRevealTimeout;
  }, []);

  return {
    isLocationResolving,
    clearLocation: () => {
      clearLocationRevealTimeout();
      setLocation(null);
      setIsLocationResolving(false);
    },
    finishLocationResolve: () => setIsLocationResolving(false),
    setLocation: (nextLocation: ResolvedLocation) => {
      clearLocationRevealTimeout();
      setLocation(nextLocation);
      locationRevealTimeoutRef.current = setTimeout(() => {
        locationRevealTimeoutRef.current = null;
        setIsLocationResolving(false);
      }, LOCATION_REVEAL_DELAY_MS);
    },
    startLocationResolve: () => {
      clearLocationRevealTimeout();
      setLocation(null);
      setIsLocationResolving(true);
    },
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
