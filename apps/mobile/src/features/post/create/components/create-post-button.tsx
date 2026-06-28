import { LoaderCircle, Upload } from "lucide-react-native";

import { Button, ButtonText } from "@acme/ui-mobile/button";

import { useColor } from "~/hooks/use-color";
import { useCreateStore } from "../store";

export function CreatePostButton({ className }: { className?: string }) {
  const canPost = useCreateStore((store) => store.canPost);
  const confirmPost = useCreateStore((store) => store.confirmPost);

  return (
    <Button
      className={className ? `${className} h-11` : "h-11"}
      disabled={!canPost}
      size="sm"
      onPress={confirmPost}
    >
      <CreatePostButtonIcon />
      <CreatePostButtonText />
    </Button>
  );
}

function CreatePostButtonIcon() {
  const hasUploadingItems = useCreateStore((store) => store.hasUploadingItems);
  const isPosting = useCreateStore((store) => store.isPosting);
  const primaryForeground = useColor("primary-foreground");

  if (hasUploadingItems || isPosting) {
    return (
      <LoaderCircle className="size-4" color={primaryForeground} size={16} />
    );
  }

  return <Upload className="size-4" color={primaryForeground} size={16} />;
}

function CreatePostButtonText() {
  const hasUploadingItems = useCreateStore((store) => store.hasUploadingItems);
  const isPosting = useCreateStore((store) => store.isPosting);

  if (hasUploadingItems)
    return <ButtonText className="text-base">Uploading</ButtonText>;
  if (isPosting) return <ButtonText className="text-base">Posting</ButtonText>;
  return <ButtonText className="text-base">Post</ButtonText>;
}
