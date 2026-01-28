import { Pressable } from "react-native";
import { Tabs } from "expo-router";
import { BellIcon, House, SearchIcon, UserRound } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { useRedirect } from "~/hooks/use-redirect";

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
  const sidebar = useColor("sidebar");
  const sidebarActiveColor = useColor("sidebar-accent-foreground");
  const sidebarInactiveColor = useColor("sidebar-foreground");
  const sidebarBorder = useColor("sidebar-border");

  const { redirectIfNotSignedIn } = useRedirect();

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
        tabBarButton: (props) => {
          const { onPress, children, ref: _ref, href, ...rest } = props;
          return (
            <Pressable
              {...rest}
              onPress={(e) => {
                redirectIfNotSignedIn({
                  redirectURL: href,
                  ifSignedIn: () => onPress?.(e),
                });
              }}
            >
              {children}
            </Pressable>
          );
        },
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
      <Tabs.Screen
        name="(profile)/[username]"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
