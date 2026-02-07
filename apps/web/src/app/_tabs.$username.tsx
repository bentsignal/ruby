import {
  createFileRoute,
  notFound,
  redirect,
  useLoaderData,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Loader } from "lucide-react";

import type { Relationship, UIProfile } from "@acme/convex/types";
import { api } from "@acme/convex/api";
import { Separator } from "@acme/ui/separator";

import { fetchAuthQuery } from "~/features/auth/lib/server";
import * as Profile from "~/features/profile/atom";
import { MainLayout } from "~/layouts/main";

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
  beforeLoad: ({ params, context }) => {
    const redirectTo =
      params.username === "my-profile" ? "/" : `/${params.username}`;
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/",
        search: { showLogin: true, redirectTo },
      });
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
  pendingComponent: LoadingProfile,
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

function LoadingProfile() {
  return (
    <MainLayout className="animate-in fade-in my-0 flex h-screen flex-col items-center justify-center gap-4 py-0 pb-8 duration-1000">
      <Loader className="size-6 animate-spin" />
    </MainLayout>
  );
}
