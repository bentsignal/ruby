import { Tabs } from "expo-router";
import { House, UserRound } from "lucide-react-native";

import { useVar } from "~/hooks/use-color";

export default function TabLayout() {
  const sidebar = useVar("sidebar");
  const sidebarPrimaryForeground = useVar("sidebar-primary-foreground");
  const sidebarAccentForeground = useVar("sidebar-accent-foreground");
  const sidebarBorder = useVar("sidebar-border");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
        tabBarStyle: {
          backgroundColor: sidebar,
          borderTopWidth: 1,
          borderTopColor: sidebarBorder,
          paddingTop: 12,
        },
        tabBarActiveTintColor: sidebarAccentForeground,
        tabBarInactiveTintColor: sidebarPrimaryForeground,
        animation: "none",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, size, focused }) => (
            <House
              strokeWidth={focused ? 2.5 : 1.75}
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="my-profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <UserRound
              strokeWidth={focused ? 2.5 : 1.75}
              color={color}
              size={size}
            />
          ),
        }}
      />
    </Tabs>
  );
}
