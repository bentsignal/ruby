import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Auth from "~/features/auth/atom";
import * as Profile from "../atom";

const ProfileLoading = () => {
  return (
    <SafeAreaView>
      <View className="flex-row items-center gap-2 px-4">
        <Profile.BlankProfileImage />
        <Auth.SignOutButton className="ml-auto" />
      </View>
    </SafeAreaView>
  );
};

export { ProfileLoading };
