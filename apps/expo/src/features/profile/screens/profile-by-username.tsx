import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";

import { api } from "@acme/convex/api";

import { BackButton } from "~/components/back-button";
import { SafeAreaView } from "~/components/safe-area-view";
import * as Auth from "~/features/auth/atom";
import { Bio } from "~/features/profile/atoms/bio";
import { Name } from "~/features/profile/atoms/name";
import { PFP } from "~/features/profile/atoms/pfp";
import { PrimaryButton } from "~/features/profile/atoms/primary-button";
import { UserProvidedLink } from "~/features/profile/atoms/user-provided-link";
import { Username } from "~/features/profile/atoms/username";
import { AccountNotFound } from "~/features/profile/molecules/account-not-found";
import { ProfileLoading } from "~/features/profile/molecules/profile-loading";
import { ProfileStore } from "~/features/profile/store";
import { ShareButton } from "../atoms/share-button";

export function ProfileByUsername() {
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

  return (
    <SafeAreaView>
      <ProfileStore profile={profile} relationship={relationship}>
        <View className="flex flex-col gap-4">
          <View className="flex-row items-center justify-between px-4">
            <BackButton />
            <ShareButton />
          </View>
          <View className="mx-4 flex-row items-center gap-4">
            <PFP variant="md" />
            <View className="flex flex-col">
              <Name />
              <Username />
            </View>
          </View>
          <Bio className="mx-4" />
          <UserProvidedLink className="mx-4" />
          <PrimaryButton className="mx-4" />
          <View className="bg-border h-px" />
        </View>
      </ProfileStore>
    </SafeAreaView>
  );
}
