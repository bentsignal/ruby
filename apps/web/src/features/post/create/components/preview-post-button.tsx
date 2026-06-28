import { useState } from "react";
import { useRouteContext } from "@tanstack/react-router";
import { Eye } from "lucide-react";

import type { ResolvedLocation } from "@acme/convex/places/types";
import { Button } from "@acme/ui-web/button";
import * as Dialog from "@acme/ui-web/dialog";

import type { PostStoreValue } from "~/features/post/store";
import { PostContent } from "~/features/post/components/post";
import { PostStore } from "~/features/post/store";
import { useCreateStore } from "../store";

export function PreviewPostButton() {
  const caption = useCreateStore((store) => store.caption);
  const isPreviewOpen = useCreateStore((store) => store.isPreviewOpen);
  const itemsLength = useCreateStore((store) => store.items.length);
  const setIsPreviewOpen = useCreateStore((store) => store.setIsPreviewOpen);
  const canPreview = itemsLength > 0 || caption.trim().length > 0;

  return (
    <Dialog.Container open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
      <Button
        disabled={!canPreview}
        onClick={() => setIsPreviewOpen(true)}
        type="button"
        variant="outline"
      >
        <Eye className="size-4" />
        Preview
      </Button>
      <Dialog.Content className="max-h-[min(90vh,860px)] max-w-[min(94vw,680px)] overflow-y-auto p-0">
        <Dialog.Title className="sr-only">Post preview</Dialog.Title>
        <div className="border-border flex items-center justify-between border-b px-5 py-4">
          <div>
            <p className="text-foreground text-lg font-bold">Post preview</p>
            <p className="text-muted-foreground text-sm">
              Check the feed version before posting.
            </p>
          </div>
        </div>
        <div className="px-5 py-5">
          <DraftPostPreview />
        </div>
      </Dialog.Content>
    </Dialog.Container>
  );
}

function DraftPostPreview() {
  const [createdAt] = useState(() => Date.now());
  const caption = useCreateStore((store) => store.caption.trim() || undefined);
  const displayAspectRatio = useCreateStore(
    (store) => store.displayAspectRatio,
  );
  const items = useCreateStore((store) => store.items);
  const location = useCreateStore((store) => store.location);
  const myProfile = useRouteContext({
    from: "/_authed",
    select: (ctx) => ctx.profile,
  });

  const value = {
    caption,
    createdAt,
    creator: myProfile,
    displayAspectRatio,
    likedByMe: false,
    like: () => undefined,
    location: createDraftPostLocation(location),
    mediaItems: items.map((item) => ({
      alt: caption ?? item.file.name,
      mediaType: item.file.type.startsWith("video/") ? "video" : "image",
      url: item.previewUrl,
    })),
    postId: "draft",
    toggleLike: () => undefined,
  } satisfies PostStoreValue;

  return (
    <div className="mx-auto max-w-xl">
      <PostStore value={value}>
        <PostContent />
      </PostStore>
    </div>
  );
}

function createDraftPostLocation(location: ResolvedLocation | null) {
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
