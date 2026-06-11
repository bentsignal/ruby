import type { ComponentType } from "react";
import type { ColorValue } from "react-native";
import { View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { BellIcon, House, SearchIcon, UserRound } from "lucide-react-native";

import { MobileTabBar } from "~/components/mobile-tab-bar";
import {
  AUTH_DESTINATION,
  useAuthDestination,
} from "~/features/auth/hooks/use-auth-destination";
import { useColor } from "~/hooks/use-color";

function TabIcon({
  icon: Icon,
  color,
  focused,
}: {
  icon: ComponentType<{ color: string; size: number; strokeWidth: number }>;
  color: ColorValue;
  focused: boolean;
}) {
  return (
    <Icon strokeWidth={focused ? 3 : 1.75} color={String(color)} size={24} />
  );
}

export default function TabLayout() {
  const backgroundColor = useColor("background");
  const destination = useAuthDestination();

  if (destination === AUTH_DESTINATION.pending) {
    return <View className="flex-1" style={{ backgroundColor }} />;
  }

  if (destination !== AUTH_DESTINATION.home) {
    return <Redirect href={destination} />;
  }

  return (
    <Tabs
      tabBar={(props) => <MobileTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor },
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="(index)"
        options={{
          tabBarLabel: "Home",
          tabBarAccessibilityLabel: "Home",
          animation: "none",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={House} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(search)"
        options={{
          tabBarLabel: "Search",
          tabBarAccessibilityLabel: "Search",
          animation: "none",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={SearchIcon} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(notifications)"
        options={{
          tabBarLabel: "Notifications",
          tabBarAccessibilityLabel: "Notifications",
          animation: "none",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={BellIcon} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="(my-profile)"
        options={{
          tabBarLabel: "Profile",
          tabBarAccessibilityLabel: "Profile",
          animation: "none",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={UserRound} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          tabBarLabel: "Create",
          tabBarAccessibilityLabel: "Create post",
          animation: "none",
        }}
      />
    </Tabs>
  );
}
