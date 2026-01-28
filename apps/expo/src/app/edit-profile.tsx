import { Text, View } from "react-native";

import { SafeAreaView } from "~/components/safe-area-view";

export default function EditProfile() {
  return (
    <SafeAreaView>
      <View className="flex flex-1 items-center justify-center px-4">
        <Text className="text-foreground text-center text-xl font-bold">
          Edit Profile
        </Text>
        <Text className="text-muted-foreground mt-2 text-center">
          Coming soon
        </Text>
      </View>
    </SafeAreaView>
  );
}
