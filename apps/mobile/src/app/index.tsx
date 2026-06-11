import type { ColorSchemeName } from "react-native";
import { useEffect } from "react";
import { Image, useColorScheme, View } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useAuthStore } from "~/features/auth/store";
import roundedIcon from "../../assets/rounded-icon.png";

const SPLASH_BACKGROUND = {
  dark: "#1e1616",
  light: "#ffe3e0",
};

const STARTUP_DESTINATION = {
  home: "/home",
  login: "/login",
  pending: "pending",
  startupError: "/startup-error",
  waitlist: "/waitlist",
} as const;

const STARTUP_FALLBACK_TIMEOUT_MS = 8_000;
let nativeSplashHasHidden = false;

function hideNativeSplash() {
  if (nativeSplashHasHidden) return;
  nativeSplashHasHidden = true;
  void SplashScreen.hideAsync();
}

export default function Startup() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const destination = useStartupDestination();

  // eslint-disable-next-line no-restricted-syntax -- Startup owns the single initial navigation after auth state resolves, with a bounded fallback.
  useEffect(() => {
    if (destination !== STARTUP_DESTINATION.pending) {
      router.replace(destination);
      return;
    }

    const timeout = setTimeout(() => {
      router.replace(STARTUP_DESTINATION.startupError);
    }, STARTUP_FALLBACK_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [destination, router]);

  return <FakeSplashScreen colorScheme={colorScheme} />;
}

function useStartupDestination() {
  const authIsLoading = useAuthStore((s) => s.authIsLoading);
  const imSignedIn = useAuthStore((s) => s.imSignedIn);
  const myProfile = useAuthStore((s) => s.myProfile);
  const waitlistStatus = useAuthStore((s) => s.waitlistStatus);
  const waitlistStatusIsLoaded = useAuthStore((s) => s.waitlistStatusIsLoaded);

  if (authIsLoading) return STARTUP_DESTINATION.pending;
  if (!imSignedIn) return STARTUP_DESTINATION.login;
  if (!myProfile || !waitlistStatusIsLoaded) {
    return STARTUP_DESTINATION.pending;
  }
  return waitlistStatus === "has-access"
    ? STARTUP_DESTINATION.home
    : STARTUP_DESTINATION.waitlist;
}

function FakeSplashScreen({ colorScheme }: { colorScheme: ColorSchemeName }) {
  return (
    <View
      className="flex-1 items-center justify-center"
      onLayout={hideNativeSplash}
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
