import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import type { Doc } from "@acme/convex/model";

import * as Auth from "~/features/auth/atom";
import * as Profile from "../atom";

const DefaultProfile = ({ profile }: { profile: Doc<"profiles"> }) => {
  return (
    <SafeAreaView>
      <Profile.Provider profile={profile}>
        <View className="flex-row items-center gap-2 px-2">
          <Profile.ProfileImage className="mt-1" />
          <Profile.ProfileInfo />
          <Auth.SignOutButton className="ml-auto" />
        </View>
      </Profile.Provider>
    </SafeAreaView>
  );
};

export { DefaultProfile };
