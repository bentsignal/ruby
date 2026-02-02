import { Stack } from "expo-router";

import { useColor } from "~/hooks/use-color";

export function TabPageStack({ children }: { children?: React.ReactNode }) {
  const backgroundColor = useColor("background");
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="[username]" />
      {children}
    </Stack>
  );
}
