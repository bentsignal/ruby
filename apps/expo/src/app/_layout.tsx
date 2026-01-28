import { useEffect } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { Provider as ConvexProvider } from "~/context/convex-context";
import * as Auth from "~/features/auth/atom";
import { useAuthDrawerSize } from "~/features/auth/hooks/use-auth-drawer-size";
import { useColor } from "~/hooks/use-color";

import "../styles.css";

import { useInitApp } from "~/hooks/use-init-app";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const backgroundColor = useColor("background");

  const liquidGlassIsAvailable = isLiquidGlassAvailable();

  const { percentage: loginDrawerHeightPercentage } = useAuthDrawerSize();

  // once initialization steps have completed, hide the splash screen
  const { backgroundColorsAreLoaded, fontsAreLoaded } = useInitApp();
  useEffect(() => {
    if (fontsAreLoaded && backgroundColorsAreLoaded) {
      void SplashScreen.hideAsync();
    }
    // if the initialization steps have not completed after 5 seconds, hide the splash screen
    setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 5000);
  }, [fontsAreLoaded, backgroundColorsAreLoaded]);

  return (
    <ConvexProvider>
      <Auth.Store>
        <SafeAreaProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: "transparent" },
            }}
          >
            <Stack.Screen name="(tabs)" />
            <Stack.Screen
              name="login"
              options={{
                presentation: "formSheet",
                sheetAllowedDetents: [loginDrawerHeightPercentage],
                sheetGrabberVisible: true,
                contentStyle: {
                  backgroundColor: liquidGlassIsAvailable
                    ? "transparent"
                    : backgroundColor,
                },
              }}
            />
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
        <StatusBar />
      </Auth.Store>
    </ConvexProvider>
  );
}
