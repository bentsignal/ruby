import type { ReactNode } from "react";
import { Text, View } from "react-native";
import { LoaderCircle, Upload } from "lucide-react-native";

import { Button, ButtonText } from "@acme/ui-mobile/button";

export function CreateHeader({
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
          <PostButtonIcon
            hasUploadingItems={hasUploadingItems}
            isPosting={isPosting}
          />
          <ButtonText>
            {getPostButtonText({ hasUploadingItems, isPosting })}
          </ButtonText>
        </Button>
      </View>
      {children}
    </View>
  );
}

function PostButtonIcon({
  hasUploadingItems,
  isPosting,
}: {
  hasUploadingItems: boolean;
  isPosting: boolean;
}) {
  if (hasUploadingItems || isPosting) {
    return <LoaderCircle className="size-4" size={16} color="white" />;
  }

  return <Upload className="size-4" size={16} color="white" />;
}

function getPostButtonText({
  hasUploadingItems,
  isPosting,
}: {
  hasUploadingItems: boolean;
  isPosting: boolean;
}) {
  if (hasUploadingItems) return "Uploading";
  if (isPosting) return "Posting";
  return "Post";
}
