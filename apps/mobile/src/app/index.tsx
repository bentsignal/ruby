import type { ColorSchemeName } from "react-native";
import { useEffect } from "react";
import { Image, useColorScheme, View } from "react-native";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import {
  AUTH_DESTINATION,
  useAuthDestination,
} from "~/features/auth/hooks/use-auth-destination";
import roundedIcon from "../../assets/rounded-icon.png";

const SPLASH_BACKGROUND = {
  dark: "#1e1616",
  light: "#ffe3e0",
};

const STARTUP_FALLBACK_TIMEOUT_MS = 8_000;
const STARTUP_ERROR_DESTINATION = "/startup-error";
let nativeSplashHasHidden = false;

function hideNativeSplash() {
  if (nativeSplashHasHidden) return;
  nativeSplashHasHidden = true;
  void SplashScreen.hideAsync();
}

export default function Startup() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const destination = useAuthDestination();

  // eslint-disable-next-line no-restricted-syntax -- Startup owns the single initial navigation after auth state resolves, with a bounded fallback.
  useEffect(() => {
    if (destination !== AUTH_DESTINATION.pending) {
      router.replace(destination);
      return;
    }

    const timeout = setTimeout(() => {
      router.replace(STARTUP_ERROR_DESTINATION);
    }, STARTUP_FALLBACK_TIMEOUT_MS);

    return () => clearTimeout(timeout);
  }, [destination, router]);

  return <FakeSplashScreen colorScheme={colorScheme} />;
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
