import { Suspense } from "react";
import { notFound } from "next/navigation";

import { api } from "@acme/convex/api";
import { Separator } from "@acme/ui/separator";

import * as Profile from "~/features/profile/atom";
import { MainLayout } from "~/layouts/main";
import { fetchAuthQuery, redirectIfNotLoggedIn } from "~/lib/auth-server";

export default async function ProfileWrapper({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  await redirectIfNotLoggedIn({ redirectURL: `/${username}` });
  return (
    <MainLayout className="flex flex-col gap-4">
      <Suspense fallback={<SkeletonProfile />}>
        <ProfilePage username={username} />
      </Suspense>
    </MainLayout>
  );
}

async function ProfilePage({ username }: { username: string }) {
  const result = await fetchAuthQuery(api.profile.getByUsername, { username });
  if (result === null) {
    return notFound();
  }
  const { info: profile, relationship } = result;
  return (
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
  );
}

function SkeletonProfile() {
  return (
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
  );
}
