import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, notFound, redirect } from "@tanstack/react-router";
import { convexQuery } from "@convex-dev/react-query";

import { api } from "@acme/convex/api";
import { Separator } from "@acme/ui/separator";

import * as Profile from "~/features/profile/atom";
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
      <Profile.Store profile={profile} relationship={relationship}>
        <div className="flex items-center gap-4">
          <Profile.PFP variant="md" />
          <div className="flex flex-col">
            <Profile.Name className="font-bold" />
            <Profile.Username />
          </div>
          <Profile.PrimaryButton className="ml-auto hidden lg:flex" />
        </div>
        <Profile.Bio />
        <Profile.UserProvidedLink className="mb-1" />
        <Profile.PrimaryButton className="flex lg:hidden" />
        <Separator />
      </Profile.Store>
    </MainLayout>
  );
}
