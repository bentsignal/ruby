import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";

import { api } from "@acme/convex/api";

import * as Auth from "~/features/auth/atom";
import { AccountNotFound } from "~/features/profile/screens/account-not-found";
import { ProfileLoading } from "~/features/profile/screens/profile-loading";
import { ProfilePage } from "~/features/profile/screens/profile-page";

export default function ProfileByUsername() {
  const { username } = useLocalSearchParams<{ username: string }>();

  const router = useRouter();
  const imNotSignedIn = Auth.useStore((s) => s.imSignedIn === false);
  const result = useQuery(api.profile.getByUsername, { username });

  if (imNotSignedIn) {
    router.push("/login");
    return null;
  }

  if (!username) {
    return <AccountNotFound />;
  }

  if (result === undefined) {
    return <ProfileLoading />;
  }

  if (result === null) {
    return <AccountNotFound />;
  }

  const { info: profile, relationship } = result;

  return <ProfilePage profile={profile} relationship={relationship} />;
}
