import {
  createFileRoute,
  notFound,
  useLoaderData,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

import type { Relationship, UIProfile } from "@acme/convex/types";
import { api } from "@acme/convex/api";
import { Separator } from "@acme/ui/separator";

import * as Profile from "~/features/profile/atom";
import { MainLayout } from "~/layouts/main";
import {
  fetchAuthQuery,
  getAuth,
  redirectIfNotLoggedIn,
} from "~/lib/auth-server";

const getProfileData = createServerFn({ method: "GET" })
  .inputValidator((username: string) => username)
  .handler(
    async ({
      data: username,
    }): Promise<{ info: UIProfile; relationship: Relationship } | null> => {
      return await fetchAuthQuery(api.profile.getByUsername, {
        username,
      });
    },
  );

export const Route = createFileRoute("/_tabs/$username")({
  beforeLoad: async ({ params }) => {
    const token = await getAuth();
    if (!token) {
      redirectIfNotLoggedIn({ redirectURL: `/${params.username}` });
    }
  },
  loader: async ({ params }) => {
    const result = await getProfileData({ data: params.username });
    if (result === null) {
      throw notFound();
    }
    return result;
  },
  component: ProfilePage,
  pendingComponent: SkeletonProfile,
  notFoundComponent: ProfileNotFound,
});

function ProfilePage() {
  const { info: profile, relationship } = useLoaderData({
    from: "/_tabs/$username",
  });

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

function SkeletonProfile() {
  return (
    <MainLayout className="flex flex-col gap-4">
      <div className="flex animate-pulse flex-col gap-5">
        <div className="flex items-center gap-4">
          <Profile.BlankPFP variant="md" />
          <div className="flex flex-col gap-2">
            <div className="bg-muted h-4 w-24 rounded-full" />
            <div className="bg-muted h-4 w-16 rounded-full" />
          </div>
          <div className="bg-muted ml-auto h-9 w-28 rounded-full" />
        </div>
        <div className="bg-muted mb-1 h-4 w-[65%] rounded-full" />
        <div className="bg-muted mb-1 h-4 w-36 rounded-full" />
        <Separator />
      </div>
    </MainLayout>
  );
}

function ProfileNotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-2xl font-bold">Profile Not Found</h1>
      <p className="text-muted-foreground">
        The profile you&apos;re looking for doesn&apos;t exist.
      </p>
    </div>
  );
}
