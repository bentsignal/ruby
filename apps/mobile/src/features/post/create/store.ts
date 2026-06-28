import { useEffect, useRef, useState } from "react";
import { Alert } from "react-native";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import { useConvexMutation } from "@convex-dev/react-query";
import { createStore } from "rostra";

import type { PostDisplayAspectRatio } from "@acme/config/posts";
import type { ResolvedLocation } from "@acme/convex/places/types";
import { DEFAULT_POST_DISPLAY_ASPECT_RATIO } from "@acme/config/posts";
import { api } from "@acme/convex/api";
import { getDisplayErrorMessage } from "@acme/std/display-error";

import type { ComposerItem } from "./types";
import { useColor } from "~/hooks/use-color";
import { useComposerReset } from "./hooks/use-composer-reset";
import { useUploadItem } from "./hooks/use-upload-item";
import {
  readCaptionDraft,
  resetCaptionDraft,
  writeCaptionDraft,
} from "./lib/caption-draft";
import { pickComposerFiles } from "./lib/pick-composer-files";

const LOCATION_REVEAL_DELAY_MS = 100;

function useInternalStore() {
  const createPost = useConvexMutation(api.posts.mutations.create);
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");
  const [items, setItems] = useState<ComposerItem[]>([]);
  const [caption, setCaptionState] = useState(() => {
    resetCaptionDraft();
    return "";
  });
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [location, setLocation] = useState<ResolvedLocation | null>(null);
  const [displayAspectRatio, setDisplayAspectRatio] =
    useState<PostDisplayAspectRatio>(DEFAULT_POST_DISPLAY_ASPECT_RATIO);
  const locationResolve = useLocationResolveState({ setLocation });
  const { resetComposer, resetKey } = useComposerReset({
    setCaptionState,
    setItems,
    resetLocation: locationResolve.clearLocation,
  });

  const hasUploadingItems = items.some((item) => item.status === "uploading");
  const hasPostContent = items.length > 0 || caption.trim().length > 0;
  const canPost = !isPosting && !hasUploadingItems && hasPostContent;

  function updateItem(itemId: string, patch: Partial<ComposerItem>) {
    setItems((current) =>
      current.map((item) => patchItem({ item, itemId, patch })),
    );
  }

  const { uploadItem } = useUploadItem({ updateItem });

  function setCaption(nextCaption: string) {
    writeCaptionDraft(nextCaption);
    setCaptionState(nextCaption);
  }

  function removeItem(itemId: string) {
    setItems((current) => current.filter((item) => item.id !== itemId));
    void Haptics.selectionAsync();
  }

  function replaceItems(nextItems: ComposerItem[]) {
    setItems(nextItems);
    void Haptics.selectionAsync();
  }

  function retryItem(item: ComposerItem) {
    updateItem(item.id, { error: undefined, status: "ready" });
  }

  async function publishPost() {
    setIsPosting(true);
    try {
      const uploadedFiles = await Promise.all(items.map(uploadItem));
      const latestCaption = readCaptionDraft().trim();
      await createPost({
        attachments: uploadedFiles.map((file) => file._id),
        caption: latestCaption || undefined,
        displayAspectRatio:
          uploadedFiles.length > 1 ? displayAspectRatio : undefined,
        location: createPostLocation(location),
      });
      resetComposer();
      setDisplayAspectRatio(DEFAULT_POST_DISPLAY_ASPECT_RATIO);
      setIsPosting(false);
      router.replace("/home");
    } catch (caughtError) {
      Alert.alert("Error", getDisplayErrorMessage(caughtError, "Post failed"));
      setIsPosting(false);
    }
  }

  function confirmPost() {
    Alert.alert("Post this update?", "It will appear on home and profile.", [
      { style: "cancel", text: "Cancel" },
      { onPress: () => void publishPost(), text: "Post" },
    ]);
  }

  return {
    canPost,
    caption,
    confirmPost,
    displayAspectRatio,
    foreground,
    isPreviewOpen,
    hasUploadingItems,
    isLocationResolving: locationResolve.isLocationResolving,
    isPosting,
    items,
    location,
    mutedForeground,
    pickFiles: () => pickComposerFiles({ setItems }),
    replaceItems,
    resetKey,
    removeItem,
    retryItem,
    clearLocation: locationResolve.clearLocation,
    finishLocationResolve: locationResolve.finishLocationResolve,
    setCaption,
    setCaptionDraft: writeCaptionDraft,
    setDisplayAspectRatio,
    setIsPreviewOpen,
    setLocation: locationResolve.setLocation,
    startLocationResolve: locationResolve.startLocationResolve,
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

function patchItem({
  item,
  itemId,
  patch,
}: {
  item: ComposerItem;
  itemId: string;
  patch: Partial<ComposerItem>;
}) {
  if (item.id !== itemId) return item;

  return { ...item, ...patch };
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
