import { createFileRoute } from "@tanstack/react-router";

import { CaptionField } from "~/features/post/create/components/caption-field";
import { CreatePostButton } from "~/features/post/create/components/create-post-button";
import { LocationField } from "~/features/post/create/components/location-field";
import { MediaDropzone } from "~/features/post/create/components/media-dropzone";
import { MediaFileInput } from "~/features/post/create/components/media-file-input";
import { PostConfirmationDialog } from "~/features/post/create/components/post-confirmation-dialog";
import { MediaGrid } from "~/features/post/create/media-grid/media-grid";
import { CreateStore, useCreateStore } from "~/features/post/create/store";

export const Route = createFileRoute("/_authed/create")({
  component: Create,
});

function Create() {
  return (
    <CreateStore>
      <CreateContent />
    </CreateStore>
  );
}

function CreateContent() {
  const isPosting = useCreateStore((store) => store.isPosting);

  if (isPosting) return <SubmittingPost />;

  return (
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
  );
}

function SubmittingPost() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6 pb-12">
      <div className="flex max-w-sm flex-col items-center text-center">
        <p className="text-foreground text-2xl font-black tracking-normal">
          Submitting post
        </p>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Hang tight for just a sec while your post goes live.
        </p>
        <LoadingBars />
      </div>
    </div>
  );
}

function LoadingBars() {
  return (
    <div className="mt-6 flex w-40 justify-center gap-2">
      <div className="bg-primary h-1 w-12 animate-pulse [animation-duration:900ms]" />
      <div className="bg-primary h-1 w-12 animate-pulse [animation-delay:150ms] [animation-duration:900ms]" />
      <div className="bg-primary h-1 w-12 animate-pulse [animation-delay:300ms] [animation-duration:900ms]" />
    </div>
  );
}
