import { useEffect } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";

import * as Auth from "~/features/auth/atom";
import { authClient } from "~/lib/auth-client";

export default function Login() {
  const router = useRouter();
  const session = authClient.useSession();
  const isSignedIn = session.data !== null;

  useEffect(() => {
    if (isSignedIn) {
      if (router.canGoBack()) {
        router.back();
      } else {
        router.replace("/");
      }
    }
  }, [isSignedIn, router]);

  return (
    <View className="flex h-full w-full flex-col items-center justify-center gap-4">
      <Auth.GoogleSignInButton />
    </View>
  );
}
