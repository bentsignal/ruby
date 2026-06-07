import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";

import { api } from "@acme/convex/api";
import { Separator } from "@acme/ui-web/separator";

import { Post } from "~/features/post/components/post";
import { PrimaryButton } from "~/features/profile/components/buttons/primary-button";
import { Bio } from "~/features/profile/components/info/bio";
import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { UserProvidedLink } from "~/features/profile/components/info/user-provided-link";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";

export const Route = createFileRoute("/_authed/$username")({
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        convexQuery(api.profile.getByUsername, { username: params.username }),
      ),
      context.queryClient.ensureQueryData(
        convexQuery(api.posts.getByUsername, { username: params.username }),
      ),
    ]);
  },
  component: ProfilePage,
});

function ProfilePage() {
  const result = useSuspenseQuery({
    ...convexQuery(api.profile.getByUsername, {
      username: Route.useParams({ select: (p) => p.username }),
    }),
    select: (data) => data,
  });

  if (result.data === null) {
    throw notFound();
  }

  const { info: profile, relationship } = result.data;
  return (
    <div className="max-w-auto mx-auto flex flex-col gap-4 px-4 pt-8 sm:max-w-md sm:pt-12 lg:max-w-xl">
      <ProfileStore profile={profile} relationship={relationship}>
        <div className="flex items-center gap-4">
          <PFP variant="md" />
          <div className="flex flex-col">
            <Name className="font-bold" />
            <Username />
          </div>
          <PrimaryButton className="ml-auto hidden lg:flex" />
        </div>
        <Bio />
        <UserProvidedLink className="mb-1" />
        <PrimaryButton className="flex lg:hidden" />
        <Separator />
      </ProfileStore>
      <ProfilePostList />
    </div>
  );
}

function ProfilePostList() {
  const { data: posts } = useSuspenseQuery({
    ...convexQuery(api.posts.getByUsername, {
      username: Route.useParams({ select: (p) => p.username }),
    }),
    select: (data) => data,
  });
  return (
    <div className="flex min-h-screen flex-col gap-6 pb-28">
      {posts.length === 0 && (
        <div className="border-border bg-card text-muted-foreground rounded-lg border p-6 text-center text-sm">
          No posts yet.
        </div>
      )}
      {posts.map((post) => (
        <Post key={post._id} post={post} />
      ))}
    </div>
  );
}
