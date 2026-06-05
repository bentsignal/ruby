import { LoaderCircle, Upload, UploadIcon } from "lucide-react";

import { Button } from "@acme/ui-web/button";
import * as Dialog from "@acme/ui-web/dialog";

export function ComposerHeader({
  canPost,
  onPost,
}: {
  canPost: boolean;
  onPost: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div>
        <h1 className="text-foreground text-2xl font-bold">
          Create a new post
        </h1>
      </div>
      <Button
        className="hidden sm:inline-flex"
        disabled={!canPost}
        onClick={onPost}
      >
        <UploadIcon className="size-4" />
        Post
      </Button>
    </div>
  );
}

export function ComposerPostActions(props: {
  canPost: boolean;
  isConfirmOpen: boolean;
  isPosting: boolean;
  isUploading: boolean;
  onConfirmOpenChange: (open: boolean) => void;
  onPost: () => void;
  onPostIntent: () => void;
}) {
  return (
    <>
      <MobilePostBar
        canPost={props.canPost}
        isUploading={props.isUploading}
        onPost={props.onPostIntent}
      />
      <ConfirmDialog
        isOpen={props.isConfirmOpen}
        isPosting={props.isPosting}
        onOpenChange={props.onConfirmOpenChange}
        onPost={props.onPost}
      />
    </>
  );
}

function MobilePostBar(props: {
  canPost: boolean;
  isUploading: boolean;
  onPost: () => void;
}) {
  const label = props.isUploading ? "Uploading..." : "Post";

  return (
    <div className="bg-background/90 fixed inset-x-0 bottom-0 border-t p-4 backdrop-blur sm:hidden">
      <Button
        className="w-full"
        disabled={!props.canPost}
        onClick={props.onPost}
      >
        {label}
      </Button>
    </div>
  );
}

function ConfirmDialog(props: {
  isOpen: boolean;
  isPosting: boolean;
  onOpenChange: (open: boolean) => void;
  onPost: () => void;
}) {
  return (
    <Dialog.Container open={props.isOpen} onOpenChange={props.onOpenChange}>
      <Dialog.Content>
        <Dialog.Header>
          <Dialog.Title>Post this update?</Dialog.Title>
          <Dialog.Description>
            Your media and caption will show on the home feed and your profile.
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Footer>
          <Button
            disabled={props.isPosting}
            variant="outline"
            onClick={() => props.onOpenChange(false)}
          >
            Cancel
          </Button>
          <PostButton isPosting={props.isPosting} onPost={props.onPost} />
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog.Container>
  );
}

function PostButton({
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
