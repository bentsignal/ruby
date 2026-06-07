import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";

import { Provider as ConvexProvider } from "~/context/convex-context";
import { useAuthDrawerSize } from "~/features/auth/hooks/use-auth-drawer-size";
import { AuthStore } from "~/features/auth/store";
import { useColor } from "~/hooks/use-color";

import "../styles.css";

import { useInitApp } from "~/hooks/use-init-app";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const backgroundColor = useColor("background");

  const liquidGlassIsAvailable = isLiquidGlassAvailable();

  const { percentage: loginDrawerHeightPercentage } = useAuthDrawerSize();

  const { backgroundColorsAreLoaded, fontsAreLoaded } = useInitApp();
  // eslint-disable-next-line no-restricted-syntax -- SplashScreen must be hidden in response to native initialization state.
  useEffect(() => {
    if (fontsAreLoaded && backgroundColorsAreLoaded) {
      void SplashScreen.hideAsync();
    }
    setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 5000);
  }, [fontsAreLoaded, backgroundColorsAreLoaded]);

  return (
    <ConvexProvider>
      <AuthStore>
        <GestureHandlerRootView className="flex-1">
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
        </GestureHandlerRootView>
        <StatusBar />
      </AuthStore>
    </ConvexProvider>
  );
}
