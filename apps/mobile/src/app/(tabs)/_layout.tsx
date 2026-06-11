import type { ComponentType } from "react";
import type { ColorValue } from "react-native";
import { View } from "react-native";
import { Redirect, Tabs } from "expo-router";
import { BellIcon, House, SearchIcon, UserRound } from "lucide-react-native";

import { MobileTabBar } from "~/components/mobile-tab-bar";
import { useAuthStore } from "~/features/auth/store";
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
  const authIsLoading = useAuthStore((s) => s.authIsLoading);
  const imSignedIn = useAuthStore((s) => s.imSignedIn);
  const myProfile = useAuthStore((s) => s.myProfile);
  const waitlistStatus = useAuthStore((s) => s.waitlistStatus);
  const waitlistStatusIsLoaded = useAuthStore((s) => s.waitlistStatusIsLoaded);
  const hasAccess = waitlistStatus === "has-access";

  if (authIsLoading) {
    return <View className="flex-1" style={{ backgroundColor }} />;
  }

  if (!imSignedIn) {
    return <Redirect href="/login" />;
  }

  if (!myProfile || !waitlistStatusIsLoaded) {
    return <View className="flex-1" style={{ backgroundColor }} />;
  }

  if (!hasAccess) {
    return <Redirect href="/waitlist" />;
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
