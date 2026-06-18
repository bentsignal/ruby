import { StrictMode, useEffect } from "react";
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

SplashScreen.setOptions({ duration: 200, fade: true });
void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useInitApp();

  return (
    <ConvexProvider>
      <AuthStore>
        <AppShell />
      </AuthStore>
    </ConvexProvider>
  );
}

function AppShell() {
  const backgroundColor = useColor("background");
  const liquidGlassIsAvailable = isLiquidGlassAvailable();

  // eslint-disable-next-line no-restricted-syntax -- Native splash must never stay up if the startup route fails to hide it.
  useEffect(() => {
    const timeout = setTimeout(() => {
      void SplashScreen.hideAsync();
    }, 4_000);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <GestureHandlerRootView className="flex-1">
        <SafeAreaProvider>
          <StrictMode>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor },
              }}
            >
              <Stack.Screen name="index" options={{ animation: "fade" }} />
              <Stack.Screen name="(tabs)" options={{ animation: "fade" }} />
              <Stack.Screen name="login" options={{ animation: "fade" }} />
              <Stack.Screen name="waitlist" options={{ animation: "fade" }} />
              <Stack.Screen
                name="startup-error"
                options={{ animation: "fade" }}
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
          </StrictMode>
        </SafeAreaProvider>
      </GestureHandlerRootView>
      <StatusBar />
    </>
  );
}
