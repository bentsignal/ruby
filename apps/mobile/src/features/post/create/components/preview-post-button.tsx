import { useState } from "react";
import { Modal, Pressable, ScrollView, Text, View } from "react-native";
import { Eye, X } from "lucide-react-native";

import type { ResolvedLocation } from "@acme/convex/places/types";
import { Button, ButtonText } from "@acme/ui-mobile/button";

import type { PostStoreValue } from "~/features/post/store";
import { SafeAreaView } from "~/components/safe-area-view";
import { useAuthStore } from "~/features/auth/store";
import { PostContent } from "~/features/post/components/post";
import { PostStore } from "~/features/post/store";
import { useColor } from "~/hooks/use-color";
import { useCreateStore } from "../store";

export function PreviewPostButton({ className }: { className?: string }) {
  const caption = useCreateStore((store) => store.caption);
  const foreground = useColor("foreground");
  const itemsLength = useCreateStore((store) => store.items.length);
  const setIsPreviewOpen = useCreateStore((store) => store.setIsPreviewOpen);
  const canPreview = itemsLength > 0 || caption.trim().length > 0;

  return (
    <>
      <Button
        disabled={!canPreview}
        className={className ? `${className} h-11` : "h-11"}
        size="sm"
        variant="outline"
        onPress={() => setIsPreviewOpen(true)}
      >
        <Eye className="size-4" color={foreground} size={16} />
        <ButtonText className="text-base" variant="outline">
          Preview
        </ButtonText>
      </Button>
      <PostPreviewModal />
    </>
  );
}

function PostPreviewModal() {
  const foreground = useColor("foreground");
  const isPreviewOpen = useCreateStore((store) => store.isPreviewOpen);
  const setIsPreviewOpen = useCreateStore((store) => store.setIsPreviewOpen);

  return (
    <Modal
      animationType="slide"
      visible={isPreviewOpen}
      onRequestClose={() => setIsPreviewOpen(false)}
    >
      <SafeAreaView className="bg-background flex-1">
        <View className="border-border flex-row items-center justify-between border-b px-4 py-3">
          <Text className="text-foreground text-lg font-black">
            Post preview
          </Text>
          <Pressable
            accessibilityLabel="Close preview"
            accessibilityRole="button"
            className="size-10 items-center justify-center rounded-full"
            onPress={() => setIsPreviewOpen(false)}
          >
            <X color={foreground} size={22} />
          </Pressable>
        </View>
        <ScrollView className="flex-1" contentContainerClassName="py-5 pb-12">
          <DraftPostPreview />
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

function DraftPostPreview() {
  const [createdAt] = useState(() => Date.now());
  const displayAspectRatio = useCreateStore(
    (store) => store.displayAspectRatio,
  );
  const myProfile = useAuthStore((store) => store.myProfile);
  const caption = useCreateStore((store) => store.caption.trim() || undefined);
  const items = useCreateStore((store) => store.items);
  const location = useCreateStore((store) => store.location);

  if (!myProfile) return null;

  const value = {
    caption,
    createdAt,
    creator: myProfile,
    displayAspectRatio,
    likedByMe: false,
    like: () => undefined,
    location: createDraftPostLocation(location),
    mediaItems: items.map((item) => ({
      mediaType: item.file.type === "video" ? "video" : "image",
      url: item.file.uri,
    })),
    postId: "draft",
    toggleLike: () => undefined,
  } satisfies PostStoreValue;

  return (
    <PostStore value={value}>
      <PostContent />
    </PostStore>
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
