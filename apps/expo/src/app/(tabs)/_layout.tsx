import { Tabs } from "expo-router";
import { BellIcon, House, SearchIcon, UserRound } from "lucide-react-native";

import { useVar } from "~/hooks/use-color";

const TabIcon = ({
  icon: Icon,
  color,
  focused,
}: {
  icon: React.ElementType;
  color: string;
  focused: boolean;
}) => {
  return <Icon strokeWidth={focused ? 3 : 1.75} color={color} size={24} />;
};

export default function TabLayout() {
  const sidebar = useVar("sidebar");
  const sidebarActiveColor = useVar("sidebar-accent-foreground");
  const sidebarInactiveColor = useVar("sidebar-foreground");
  const sidebarBorder = useVar("sidebar-border");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: "transparent" },
        tabBarStyle: {
          backgroundColor: sidebar,
          borderTopWidth: 1,
          paddingTop: 4,
          borderTopColor: sidebarBorder,
        },
        tabBarActiveTintColor: sidebarActiveColor,
        tabBarInactiveTintColor: sidebarInactiveColor,
        tabBarShowLabel: false,
        animation: "none",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={House} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          tabBarLabel: "Search",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={SearchIcon} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          tabBarLabel: "Notifications",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={BellIcon} color={color} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="my-profile"
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <TabIcon icon={UserRound} color={color} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}
