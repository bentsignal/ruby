import { View } from "react-native";

import type { Relationship, UIProfile } from "@acme/convex/types";

import { SafeAreaView } from "~/components/safe-area-view";
import * as Auth from "~/features/auth/atom";
import * as Profile from "~/features/profile/atom";

function ProfilePage({
  profile,
  relationship,
}: {
  profile: UIProfile;
  relationship: Relationship;
}) {
  return (
    <SafeAreaView>
      <Profile.Store profile={profile} relationship={relationship}>
        <View className="flex flex-col gap-4 px-4 pt-4">
          <View className="flex-row items-center gap-4">
            <Profile.PFP variant="md" />
            <View className="flex flex-col">
              <Profile.Name className="font-bold" />
              <Profile.Username />
            </View>
            <Auth.SignOutButton className="ml-auto" />
          </View>
          <Profile.Bio />
          <Profile.UserProvidedLink />
          <Profile.PrimaryButton />
          <View className="bg-border h-px" />
        </View>
      </Profile.Store>
    </SafeAreaView>
  );
}

export { ProfilePage };
