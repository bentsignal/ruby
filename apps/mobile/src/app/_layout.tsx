import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { Provider as ConvexProvider } from "~/context/convex-context";
import { AuthStore } from "~/features/auth/store";
import { useColor } from "~/hooks/use-color";

import "../styles.css";

import { useInitApp } from "~/hooks/use-init-app";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { backgroundColorsAreLoaded, fontsAreLoaded } = useInitApp();

  return (
    <ConvexProvider>
      <AuthStore>
        <AppShell
          backgroundColorsAreLoaded={backgroundColorsAreLoaded}
          fontsAreLoaded={fontsAreLoaded}
        />
      </AuthStore>
    </ConvexProvider>
  );
}

function AppShell({
  backgroundColorsAreLoaded,
  fontsAreLoaded,
}: {
  backgroundColorsAreLoaded: boolean;
  fontsAreLoaded: boolean;
}) {
  const backgroundColor = useColor("background");
  const liquidGlassIsAvailable = isLiquidGlassAvailable();

  // eslint-disable-next-line no-restricted-syntax -- Native splash hands off to the startup route after app assets initialize.
  useEffect(() => {
    if (!fontsAreLoaded || !backgroundColorsAreLoaded) {
      return;
    }
    const timeout = setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 100);
    return () => clearTimeout(timeout);
  }, [backgroundColorsAreLoaded, fontsAreLoaded]);

  return (
    <>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen name="index" options={{ animation: "fade" }} />
            <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
            <Stack.Screen name="login" options={{ animation: "fade" }} />
            <Stack.Screen name="waitlist" options={{ animation: "fade" }} />
            <Stack.Screen
              name="edit-profile"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [1],
                sheetGrabberVisible: true,
                contentStyle: {
                  backgroundColor: liquidGlassIsAvailable
                    ? "transparent"
                    : backgroundColor,
                },
              }}
            />
          </Stack>
        </SafeAreaProvider>
      </GestureHandlerRootView>
      <StatusBar />
    </>
  );
}
