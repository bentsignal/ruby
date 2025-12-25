import { Text, View } from "react-native";
import { router } from "expo-router";
import { LogIn } from "lucide-react-native";

import { Button, ButtonText } from "~/atoms/button";
import { useVar } from "~/hooks/use-color";

const MyProfileNotSignedIn = () => {
  const primaryForeground = useVar("primary-foreground");

  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-foreground text-center text-lg font-bold">
        Welcome!
      </Text>
      <Text className="text-muted-foreground text-center text-sm">
        Sign in to view your profile.
      </Text>
      <Button className="mt-2" onPress={() => router.push("/login")}>
        <LogIn color={primaryForeground} size={16} />
        <ButtonText>Take me to login</ButtonText>
      </Button>
    </View>
  );
};

export { MyProfileNotSignedIn };
