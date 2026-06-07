import { createFileRoute } from "@tanstack/react-router";

import { CaptionField } from "~/features/post/create/components/caption-field";
import { ComposerError } from "~/features/post/create/components/composer-error";
import { CreatePostButton } from "~/features/post/create/components/create-post-button";
import { MediaDropzone } from "~/features/post/create/components/media-dropzone";
import { MediaFileInput } from "~/features/post/create/components/media-file-input";
import { MediaGrid } from "~/features/post/create/components/media-grid";
import { MobileCreatePostBar } from "~/features/post/create/components/mobile-create-post-bar";
import { PostConfirmationDialog } from "~/features/post/create/components/post-confirmation-dialog";
import { CreateStore } from "~/features/post/create/store";

export const Route = createFileRoute("/_authed/create")({
  component: Create,
});

function Create() {
  return (
    <CreateStore>
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 pt-6 pb-28 sm:px-6 sm:pt-10">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-foreground text-2xl font-bold">
            Create a new post
          </h1>
          <CreatePostButton className="hidden sm:inline-flex" />
        </div>
        <MediaFileInput />
        <MediaDropzone />
        <MediaGrid />
        <CaptionField />
        <ComposerError />
        <MobileCreatePostBar />
        <PostConfirmationDialog />
      </div>
    </CreateStore>
  );
}
