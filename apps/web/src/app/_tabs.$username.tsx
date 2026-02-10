import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";

import { api } from "@acme/convex/api";
import { Separator } from "@acme/ui/separator";

import { Bio } from "~/features/profile/atoms/bio";
import { Name } from "~/features/profile/atoms/name";
import { PFP } from "~/features/profile/atoms/pfp";
import { PrimaryButton } from "~/features/profile/atoms/primary-button";
import { UserProvidedLink } from "~/features/profile/atoms/user-provided-link";
import { Username } from "~/features/profile/atoms/username";
import { ProfileStore } from "~/features/profile/store";
import { MainLayout } from "~/layouts/main";

export const Route = createFileRoute("/_tabs/$username")({
  beforeLoad: ({ params, context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: {
          redirect_uri:
            params.username === "my-profile" ? "/" : `/${params.username}`,
        },
      });
    }
  },
  loader: async ({ context, params }) => {
    await Promise.all([
      context.queryClient.ensureQueryData(
        convexQuery(api.profile.getByUsername, { username: params.username }),
      ),
      // TODO use ensureInfiniteQueryData for post
    ]);
  },
  component: ProfilePage,
});

function ProfilePage() {
  const params = Route.useParams();
  const result = useSuspenseQuery(
    convexQuery(api.profile.getByUsername, {
      username: params.username,
    }),
  );
  if (result.data === null) {
    throw notFound();
  }
  const { info: profile, relationship } = result.data;
  return (
    <MainLayout className="flex flex-col gap-4">
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
    </MainLayout>
  );
}
