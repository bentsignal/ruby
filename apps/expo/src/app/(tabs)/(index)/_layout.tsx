import { Stack } from "expo-router";

import { TabPageStack } from "../tab-page-stack";

export default function Layout() {
  return (
    <TabPageStack>
      <Stack.Screen name="settings" options={{ headerShown: true }} />
    </TabPageStack>
  );
}
