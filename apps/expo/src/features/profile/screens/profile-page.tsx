import { View } from "react-native";

import type { Relationship, UIProfile } from "@acme/convex/types";

import { SafeAreaView } from "~/components/safe-area-view";
import * as Auth from "~/features/auth/atom";
import { Bio } from "~/features/profile/atoms/bio";
import { Name } from "~/features/profile/atoms/name";
import { PFP } from "~/features/profile/atoms/pfp";
import { PrimaryButton } from "~/features/profile/atoms/primary-button";
import { UserProvidedLink } from "~/features/profile/atoms/user-provided-link";
import { Username } from "~/features/profile/atoms/username";
import { ProfileStore } from "~/features/profile/store";

export function ProfilePage({
  profile,
  relationship,
}: {
  profile: UIProfile;
  relationship: Relationship;
}) {
  return (
    <SafeAreaView>
      <ProfileStore profile={profile} relationship={relationship}>
        <View className="flex flex-col gap-4 pt-4">
          <View className="mx-4 flex-row items-center gap-4">
            <PFP variant="md" />
            <View className="flex flex-col">
              <Name />
              <Username />
            </View>
            <Auth.SignOutButton className="ml-auto" />
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
