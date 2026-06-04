import { Pressable, View } from "react-native";
import { Tabs, usePathname, useRouter } from "expo-router";
import {
  BellIcon,
  House,
  PencilLine,
  SearchIcon,
  UserRound,
} from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { useRedirect } from "~/hooks/use-redirect";

const ROOT_TAB_PATHS = new Set(["/", "/notifications", "/my-profile"]);

function TabIcon({
  icon: Icon,
  color,
  focused,
}: {
  icon: React.ElementType;
  color: string;
  focused: boolean;
}) {
  return <Icon strokeWidth={focused ? 3 : 1.75} color={color} size={24} />;
}

function CreatePostButton({
  primary,
  primaryForeground,
  redirectIfNotSignedIn,
}: {
  primary: string;
  primaryForeground: string;
  redirectIfNotSignedIn: (args: {
    redirectURL?: string;
    ifSignedIn: () => void;
  }) => void;
}) {
  const router = useRouter();

  return (
    <Pressable
      accessibilityLabel="Create post"
      className="absolute items-center justify-center rounded-full active:opacity-90"
      onPress={() => {
        redirectIfNotSignedIn({
          redirectURL: "/create",
          ifSignedIn: () => router.push("/create"),
        });
      }}
      style={{
        backgroundColor: primary,
        bottom: 100,
        elevation: 6,
        height: 52,
        right: 16,
        shadowColor: "#000",
        shadowOffset: { height: 3, width: 0 },
        shadowOpacity: 0.22,
        shadowRadius: 6,
        width: 52,
      }}
    >
      <PencilLine color={primaryForeground} size={22} strokeWidth={2.25} />
    </Pressable>
  );
}

export default function TabLayout() {
  const pathname = usePathname();
  const sidebar = useColor("sidebar");
  const sidebarActiveColor = useColor("sidebar-accent-foreground");
  const sidebarInactiveColor = useColor("sidebar-foreground");
  const sidebarBorder = useColor("sidebar-border");
  const primary = useColor("primary");
  const primaryForeground = useColor("primary-foreground");

  const { redirectIfNotSignedIn } = useRedirect();
  const showCreateButton = ROOT_TAB_PATHS.has(pathname);

  return (
    <View className="flex-1">
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
          name="(index)"
          options={{
            tabBarLabel: "Home",
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
            animation: "none",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={BellIcon} color={color} focused={focused} />
            ),
          }}
        />
        <Tabs.Screen
          name="create"
          options={{ href: null, animation: "none" }}
        />
        <Tabs.Screen
          name="(my-profile)"
          options={{
            tabBarLabel: "Profile",
            animation: "none",
            tabBarIcon: ({ color, focused }) => (
              <TabIcon icon={UserRound} color={color} focused={focused} />
            ),
          }}
        />
      </Tabs>
      {showCreateButton && (
        <CreatePostButton
          primary={primary}
          primaryForeground={primaryForeground}
          redirectIfNotSignedIn={redirectIfNotSignedIn}
        />
      )}
    </View>
  );
}
