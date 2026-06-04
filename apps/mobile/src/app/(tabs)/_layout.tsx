import type { ComponentType } from "react";
import { Tabs } from "expo-router";
import { BellIcon, House, SearchIcon, UserRound } from "lucide-react-native";

import { MobileTabBar } from "~/components/mobile-tab-bar";

function TabIcon({
  icon: Icon,
  color,
  focused,
}: {
  icon: ComponentType<{ color: string; size: number; strokeWidth: number }>;
  color: string;
  focused: boolean;
}) {
  return <Icon strokeWidth={focused ? 3 : 1.75} color={color} size={24} />;
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <MobileTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
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
