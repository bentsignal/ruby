import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import * as Auth from "~/features/auth/atom";
import { authClient } from "~/lib/auth-client";

const NotSignedIn = () => {
  return (
    <View className="h-full w-full flex-col items-center justify-center gap-2">
      <Auth.TakeMeToLogin />
    </View>
  );
};

export default function MyProfile() {
  const insets = useSafeAreaInsets();
  const session = authClient.useSession();
  const imSignedOut = session.data === null;

  if (imSignedOut) {
    return <NotSignedIn />;
  }

  return (
    <View className="w-full px-4" style={{ paddingTop: insets.top }}>
      <Auth.SignOutButton />
      <Text className="text-foreground text-2xl font-bold">My Profile</Text>
      <View className="flex-row items-center">
        <Text className="text-foreground font-bold">Email: </Text>
        <Text className="text-muted-foreground">
          {session.data?.user.email}
        </Text>
      </View>
      <View className="flex-row items-center">
        <Text className="text-foreground font-bold">Name: </Text>
        <Text className="text-muted-foreground">{session.data?.user.name}</Text>
      </View>
    </View>
  );
}
