import { useEffect, useState } from "react";
import { Image, useColorScheme, View } from "react-native";
import { useRouter } from "expo-router";

import { useAuthStore } from "~/features/auth/store";
import roundedIcon from "../../assets/rounded-icon.png";

const SPLASH_BACKGROUND = {
  dark: "#1e1616",
  light: "#ffe3e0",
};
const STARTUP_FALLBACK_TIMEOUT_MS = 8_000;

export default function Startup() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const authIsLoading = useAuthStore((s) => s.authIsLoading);
  const imSignedIn = useAuthStore((s) => s.imSignedIn);
  const myProfile = useAuthStore((s) => s.myProfile);
  const waitlistStatus = useAuthStore((s) => s.waitlistStatus);
  const waitlistStatusIsLoaded = useAuthStore((s) => s.waitlistStatusIsLoaded);
  const [fallbackHasElapsed, setFallbackHasElapsed] = useState(false);

  // eslint-disable-next-line no-restricted-syntax -- Startup route should never be able to strand the user indefinitely.
  useEffect(() => {
    const timeout = setTimeout(() => {
      setFallbackHasElapsed(true);
    }, STARTUP_FALLBACK_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, []);

  // eslint-disable-next-line no-restricted-syntax -- Startup route owns the first navigation after auth state resolves.
  useEffect(() => {
    if (authIsLoading) {
      if (fallbackHasElapsed) {
        router.replace("/login");
      }
      return;
    }

    if (!imSignedIn) {
      router.replace("/login");
      return;
    }

    if (!myProfile || !waitlistStatusIsLoaded) {
      if (fallbackHasElapsed) {
        router.replace("/waitlist");
      }
      return;
    }

    router.replace(waitlistStatus === "has-access" ? "/home" : "/waitlist");
  }, [
    authIsLoading,
    fallbackHasElapsed,
    imSignedIn,
    myProfile,
    router,
    waitlistStatus,
    waitlistStatusIsLoaded,
  ]);

  return (
    <View
      className="flex-1 items-center justify-center"
      style={{
        backgroundColor:
          colorScheme === "dark"
            ? SPLASH_BACKGROUND.dark
            : SPLASH_BACKGROUND.light,
      }}
    >
      <Image
        accessibilityLabel="Ruby"
        resizeMode="contain"
        source={roundedIcon}
        style={{ height: 100, width: 100 }}
      />
    </View>
  );
}
