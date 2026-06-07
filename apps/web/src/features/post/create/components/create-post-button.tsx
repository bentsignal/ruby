import { UploadIcon } from "lucide-react";

import { Button } from "@acme/ui-web/button";

import { useCreateStore } from "../store";

export function CreatePostButton({ className }: { className?: string }) {
  const canPost = useCreateStore((store) => store.canPost);
  const openConfirm = useCreateStore((store) => store.openConfirm);

  return (
    <Button className={className} disabled={!canPost} onClick={openConfirm}>
      <UploadIcon className="size-4" />
      Post
    </Button>
  );
}
