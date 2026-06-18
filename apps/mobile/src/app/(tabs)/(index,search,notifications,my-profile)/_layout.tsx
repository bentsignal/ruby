import { Stack } from "expo-router";

import { useColor } from "~/hooks/use-color";

export const unstable_settings = {
  initialRouteName: "index",
  search: {
    initialRouteName: "search",
  },
  notifications: {
    initialRouteName: "notifications",
  },
  "my-profile": {
    initialRouteName: "my-profile",
  },
};

export default function Layout({ segment }: { segment: string }) {
  const backgroundColor = useColor("background");
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor },
      }}
    >
      <SettingsScreen segment={segment} />
    </Stack>
  );
}

function SettingsScreen({ segment }: { segment: string }) {
  if (segment !== "(index)") return null;

  return <Stack.Screen name="settings" options={{ headerShown: true }} />;
}
