import { useEffect } from "react";
import { Text, View } from "react-native";
import { useRouter } from "expo-router";

import * as Auth from "~/features/auth/atom";
import { authClient } from "~/lib/auth-client";

export default function Login() {
  const router = useRouter();
  const session = authClient.useSession();
  const imSignedIn = session.data !== null;

  useEffect(() => {
    if (imSignedIn) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  }, [imSignedIn, router]);

  return (
    <View className="h-full w-full flex-col gap-4 px-6 py-8">
      <Text className="text-foreground text-2xl font-bold">Welcome Back!</Text>
      <Auth.GoogleSignInButton />
    </View>
  );
}
