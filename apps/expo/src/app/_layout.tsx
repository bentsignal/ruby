import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { Provider } from "~/context/convex-context";

import "../styles.css";

import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  useEffect(() => {
    const hideSplashScreen = async () => {
      await SplashScreen.hideAsync();
    };
    setTimeout(() => {
      void hideSplashScreen();
    }, 4000);
  }, []);

  return (
    <Provider>
      <SafeAreaProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle:
              colorScheme === "dark"
                ? { backgroundColor: "#18181B" }
                : { backgroundColor: "#E4E4E7" },
          }}
        >
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="login" />
        </Stack>
      </SafeAreaProvider>
      <StatusBar />
    </Provider>
  );
}
