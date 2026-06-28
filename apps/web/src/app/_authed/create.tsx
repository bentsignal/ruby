// eslint-disable-next-line no-restricted-imports -- Create access is client-loaded so the locked state can update live.
import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";
import { LockKeyhole } from "lucide-react";

import { api } from "@acme/convex/api";

import { AspectRatioField } from "~/features/post/create/components/aspect-ratio-field";
import { CaptionField } from "~/features/post/create/components/caption-field";
import { CreatePostButton } from "~/features/post/create/components/create-post-button";
import { LocationField } from "~/features/post/create/components/location-field";
import { MediaDropzone } from "~/features/post/create/components/media-dropzone";
import { MediaFileInput } from "~/features/post/create/components/media-file-input";
import { PostConfirmationDialog } from "~/features/post/create/components/post-confirmation-dialog";
import { PreviewPostButton } from "~/features/post/create/components/preview-post-button";
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
  const { data: permissions } = useQuery({
    ...convexQuery(api.permissions.queries.getMine, {}),
    select: (value) => value,
  });
  if (!permissions) return <CreateAccessLoading />;

  const canPost = permissions.includes("can-post");
  if (!canPost) return <CreateClosedBeta />;

  if (isPosting) return <SubmittingPost />;

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 pt-6 pb-28 sm:px-6 sm:pt-10">
      <div className="mb-7 flex items-center justify-between gap-4">
        <h1 className="text-foreground text-2xl font-bold">
          Create a new post
        </h1>
        <div className="flex items-center gap-2">
          <PreviewPostButton />
          <CreatePostButton />
        </div>
      </div>
      <div className="flex flex-col gap-6">
        <MediaFileInput />
        <MediaDropzone />
        <MediaGrid />
        <AspectRatioField />
        <LocationField />
        <CaptionField />
      </div>
      <PostConfirmationDialog />
    </div>
  );
}

function CreateAccessLoading() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center px-6 pb-12">
      <LoadingBars />
    </div>
  );
}

function CreateClosedBeta() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center px-5 pb-24">
      <section className="flex max-w-sm flex-col items-center text-center">
        <div className="text-primary mb-4 flex flex-col items-center gap-3">
          <LockKeyhole size={34} strokeWidth={1.9} />
          <div className="bg-primary h-1 w-10 rounded-full" />
        </div>
        <p className="text-foreground text-2xl font-black tracking-normal">
          Posting is invite only
        </p>
        <p className="text-muted-foreground mt-3 text-sm leading-6">
          Ruby is in closed beta, so only invited members can share posts right
          now.
        </p>
      </section>
    </main>
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
