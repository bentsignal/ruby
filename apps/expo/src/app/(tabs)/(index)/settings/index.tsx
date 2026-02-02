import { Text, View } from "react-native";

import { SignOutButton } from "~/features/auth/atom";

export default function Settings() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-foreground text-2xl font-bold">Settings</Text>
      <SignOutButton />
    </View>
  );
}
