import { LoaderCircle, Upload } from "lucide-react-native";

import { Button, ButtonText } from "@acme/ui-mobile/button";

import { useCreateStore } from "../store";

export function CreatePostButton() {
  const canPost = useCreateStore((store) => store.canPost);
  const confirmPost = useCreateStore((store) => store.confirmPost);

  return (
    <Button disabled={!canPost} size="sm" onPress={confirmPost}>
      <CreatePostButtonIcon />
      <CreatePostButtonText />
    </Button>
  );
}

function CreatePostButtonIcon() {
  const hasUploadingItems = useCreateStore((store) => store.hasUploadingItems);
  const isPosting = useCreateStore((store) => store.isPosting);

  if (hasUploadingItems || isPosting) {
    return <LoaderCircle className="size-4" size={16} color="white" />;
  }

  return <Upload className="size-4" size={16} color="white" />;
}

function CreatePostButtonText() {
  const hasUploadingItems = useCreateStore((store) => store.hasUploadingItems);
  const isPosting = useCreateStore((store) => store.isPosting);

  if (hasUploadingItems) return <ButtonText>Uploading</ButtonText>;
  if (isPosting) return <ButtonText>Posting</ButtonText>;
  return <ButtonText>Post</ButtonText>;
}
