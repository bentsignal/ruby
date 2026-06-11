import { Image, Text, View } from "react-native";

import { SafeAreaView } from "~/components/safe-area-view";
import { SignInButton } from "~/features/auth/components/sign-in-button";
import logo from "../../assets/rounded-icon.png";

export default function Login() {
  return (
    <SafeAreaView className="bg-background relative flex-1" bottom>
      <View className="bg-muted/20 absolute inset-0" />
      <View className="h-full w-full flex-col items-center justify-center gap-3 px-6 py-10">
        <Image source={logo} className="mb-2 size-20 rounded-[22px]" />
        <SignInButton />
        <Text className="text-muted-foreground max-w-[320px] text-center text-sm leading-6">
          By continuing you agree to our Terms & Privacy Policy
        </Text>
      </View>
    </SafeAreaView>
  );
}
