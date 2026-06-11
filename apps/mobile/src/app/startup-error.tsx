import { Image, Text, View } from "react-native";

import { SafeAreaView } from "~/components/safe-area-view";
import roundedIcon from "../../assets/rounded-icon.png";

export default function StartupError() {
  return (
    <SafeAreaView className="bg-background flex-1" bottom>
      <View className="flex-1 items-center justify-center gap-5 px-8">
        <Image
          accessibilityLabel="Ruby"
          resizeMode="contain"
          source={roundedIcon}
          style={{ height: 72, width: 72 }}
        />
        <View className="max-w-[280px] gap-2">
          <Text className="text-foreground text-center text-xl font-semibold">
            Something went wrong
          </Text>
          <Text className="text-muted-foreground text-center text-sm leading-6">
            Sorry about that. Check back in a little bit, hopefully we've fixed
            it by then.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
