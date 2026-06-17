import { createFileRoute } from "@tanstack/react-router";

import { CaptionField } from "~/features/post/create/components/caption-field";
import { CreatePostButton } from "~/features/post/create/components/create-post-button";
import { LocationField } from "~/features/post/create/components/location-field";
import { MediaDropzone } from "~/features/post/create/components/media-dropzone";
import { MediaFileInput } from "~/features/post/create/components/media-file-input";
import { PostConfirmationDialog } from "~/features/post/create/components/post-confirmation-dialog";
import { MediaGrid } from "~/features/post/create/media-grid/media-grid";
import { CreateStore } from "~/features/post/create/store";

export const Route = createFileRoute("/_authed/create")({
  component: Create,
});

function Create() {
  return (
    <CreateStore>
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pt-6 pb-28 sm:px-6 sm:pt-10">
        <div className="mb-7 flex items-center justify-between gap-4">
          <h1 className="text-foreground text-2xl font-bold">
            Create a new post
          </h1>
          <CreatePostButton />
        </div>
        <div className="flex flex-col gap-6">
          <MediaFileInput />
          <MediaDropzone />
          <MediaGrid />
          <LocationField />
          <CaptionField />
        </div>
        <PostConfirmationDialog />
      </div>
    </CreateStore>
  );
}
