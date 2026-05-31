import { View } from "react-native";

import { SafeAreaView } from "~/components/safe-area-view";
import { useAuthStore } from "~/features/auth/store";
import { MyProfileButtons } from "~/features/profile/components/buttons/my-profile-buttons";
import { Bio } from "~/features/profile/components/info/bio";
import { Name } from "~/features/profile/components/info/name";
import { PFP } from "~/features/profile/components/info/pfp";
import { UserProvidedLink } from "~/features/profile/components/info/user-provided-link";
import { Username } from "~/features/profile/components/info/username";
import { ProfileLoading } from "~/features/profile/components/profile-loading";
import { ProfileStore } from "~/features/profile/store";

export default function MyProfile() {
  const myProfile = useAuthStore((s) => s.myProfile);
  if (!myProfile) {
    return <ProfileLoading />;
  }
  return (
    <SafeAreaView>
      <ProfileStore profile={myProfile} relationship={"my-profile"}>
        <View className="flex flex-col gap-4 pt-4">
          <View className="mx-4 flex-row items-center gap-4">
            <PFP variant="md" />
            <View className="flex flex-col">
              <Name />
              <Username />
            </View>
          </View>
          <Bio className="mx-4" />
          <UserProvidedLink className="mx-4" />
          <MyProfileButtons className="mx-4" />
          <View className="bg-border h-px" />
        </View>
      </ProfileStore>
    </SafeAreaView>
  );
}
