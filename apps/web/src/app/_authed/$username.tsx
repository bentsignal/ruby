import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";

import { api } from "@acme/convex/api";
import { Separator } from "@acme/ui-web/separator";

import { PostList } from "~/features/post/components/post-list";
import { PrimaryButton } from "~/features/profile/components/buttons/primary-button";
import { Bio } from "~/features/profile/components/info/bio";
import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { UserProvidedLink } from "~/features/profile/components/info/user-provided-link";
import { Username } from "~/features/profile/components/info/username";
import { ProfileStore } from "~/features/profile/store";

export const Route = createFileRoute("/_authed/$username")({
  loader: async ({ context, params }) => {
    await context.queryClient.ensureQueryData(
      convexQuery(api.profile.getByUsername, { username: params.username }),
    );
  },
  component: ProfilePage,
});

function ProfilePage() {
  const params = Route.useParams();
  const result = useSuspenseQuery({
    ...convexQuery(api.profile.getByUsername, {
      username: params.username,
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
      <PostList username={params.username} />
    </div>
  );
}
