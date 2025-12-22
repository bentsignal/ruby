import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Provider } from "~/context/convex-context";

import "../styles.css";

import { useEffect } from "react";
import { useColorScheme } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import * as SystemUI from "expo-system-ui";

import { useVar } from "~/hooks/use-color";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const backgroundColor = useVar("background");
  const colorScheme = useColorScheme();

  useEffect(() => {
    const init = async () => {
      await SystemUI.setBackgroundColorAsync(backgroundColor);
      await SplashScreen.hideAsync();
    };
    void init();
  }, [backgroundColor]);

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync(backgroundColor);
  }, [backgroundColor, colorScheme]);

  return (
    <Provider>
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
              sheetAllowedDetents: [0.45],
              sheetGrabberVisible: true,
            }}
          />
        </Stack>
      </SafeAreaProvider>
      <StatusBar />
    </Provider>
  );
}
