import { Button } from "@acme/ui-web/button";

import { useCreateStore } from "../store";

export function MobileCreatePostBar() {
  const canPost = useCreateStore((store) => store.canPost);
  const isUploading = useCreateStore((store) => store.hasUploadingItems);
  const openConfirm = useCreateStore((store) => store.openConfirm);
  const label = isUploading ? "Uploading..." : "Post";

  return (
    <div className="bg-background/90 fixed inset-x-0 bottom-0 border-t p-4 backdrop-blur sm:hidden">
      <Button className="w-full" disabled={!canPost} onClick={openConfirm}>
        {label}
      </Button>
    </div>
  );
}
