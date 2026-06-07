import { LoaderCircle, Upload } from "lucide-react";

import { Button } from "@acme/ui-web/button";
import * as Dialog from "@acme/ui-web/dialog";

import { useCreateStore } from "../store";

export function PostConfirmationDialog() {
  const isOpen = useCreateStore((store) => store.isConfirmOpen);
  const isPosting = useCreateStore((store) => store.isPosting);
  const publishPost = useCreateStore((store) => store.publishPost);
  const setIsConfirmOpen = useCreateStore((store) => store.setIsConfirmOpen);

  return (
    <Dialog.Container open={isOpen} onOpenChange={setIsConfirmOpen}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Post this update?</Dialog.Title>
          <Dialog.Description>
            Your media and caption will show on the home feed and your profile.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button
            disabled={isPosting}
            variant="outline"
            onClick={() => setIsConfirmOpen(false)}
          >
            Cancel
          </Button>
          <ConfirmPostButton isPosting={isPosting} onPost={publishPost} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
}

function ConfirmPostButton({
  isPosting,
  onPost,
}: {
  isPosting: boolean;
  onPost: () => void;
}) {
  if (isPosting) {
    return (
      <Button disabled onClick={onPost}>
        <LoaderCircle className="size-4 animate-spin" />
        Posting
      </Button>
    );
  }

  return (
    <Button onClick={onPost}>
      <Upload className="size-4" />
      Post
    </Button>
  );
}
