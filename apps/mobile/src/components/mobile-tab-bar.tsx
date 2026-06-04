import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { GlassView, isLiquidGlassAvailable } from "expo-glass-effect";
import * as Haptics from "expo-haptics";
import { PlusIcon } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { useRedirect } from "~/hooks/use-redirect";

const TAB_BAR_HEIGHT = 64;

type MobileTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

type TabBarRoute = MobileTabBarProps["state"]["routes"][number];
type TabBarNavigation = MobileTabBarProps["navigation"];
type TabBarOptions = MobileTabBarProps["descriptors"][string]["options"];

function CreateTabIcon({
  primary,
  primaryForeground,
}: {
  primary: string;
  primaryForeground: string;
}) {
  return (
    <View
      style={[
        styles.createTab,
        {
          backgroundColor: primary,
        },
      ]}
    >
      <PlusIcon color={primaryForeground} size={22} strokeWidth={2} />
    </View>
  );
}

function TabBarBackdrop({
  liquidGlassIsAvailable,
  sidebar,
}: {
  liquidGlassIsAvailable: boolean;
  sidebar: string;
}) {
  if (!liquidGlassIsAvailable) {
    return (
      <View
        style={[
          StyleSheet.absoluteFill,
          {
            backgroundColor: `${sidebar}CC`,
          },
        ]}
      />
    );
  }

  return (
    <GlassView
      glassEffectStyle="regular"
      isInteractive
      style={StyleSheet.absoluteFill}
      tintColor={sidebar}
    />
  );
}

function TabBarButton({
  color,
  href,
  isFocused,
  navigation,
  options,
  primary,
  primaryForeground,
  route,
}: {
  color: string;
  href: string | undefined;
  isFocused: boolean;
  navigation: TabBarNavigation;
  options: TabBarOptions | undefined;
  primary: string;
  primaryForeground: string;
  route: TabBarRoute;
}) {
  const { redirectIfNotSignedIn } = useRedirect();
  const isCreate = route.name === "create";

  return (
    <Pressable
      accessibilityLabel={options?.tabBarAccessibilityLabel}
      accessibilityRole="button"
      accessibilityState={isFocused ? { selected: true } : {}}
      onLongPress={() => {
        navigation.emit({
          type: "tabLongPress",
          target: route.key,
        });
      }}
      onPress={() => {
        void Haptics.selectionAsync();
        redirectIfNotSignedIn({
          redirectURL: href,
          ifSignedIn: () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          },
        });
      }}
      style={styles.tabBarItem}
    >
      {isCreate ? (
        <CreateTabIcon
          primary={primary}
          primaryForeground={primaryForeground}
        />
      ) : (
        options?.tabBarIcon?.({
          color,
          focused: isFocused,
          size: 24,
        })
      )}
    </Pressable>
  );
}

function getTabHref(routeName: string) {
  switch (routeName) {
    case "(index)":
      return "/";
    case "(search)":
      return "/search";
    case "(notifications)":
      return "/notifications";
    case "(my-profile)":
      return "/my-profile";
    case "create":
      return "/create";
    default:
      return undefined;
  }
}

export function MobileTabBar({
  state,
  descriptors,
  navigation,
  insets,
}: MobileTabBarProps) {
  const sidebar = useColor("sidebar");
  const sidebarActiveColor = useColor("sidebar-accent-foreground");
  const sidebarInactiveColor = useColor("sidebar-foreground");
  const sidebarBorder = useColor("sidebar-border");
  const primary = useColor("primary");
  const primaryForeground = useColor("primary-foreground");
  const liquidGlassIsAvailable = isLiquidGlassAvailable();

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.tabBarFrame,
        {
          bottom: Math.max(insets.bottom, 12),
        },
      ]}
    >
      <View
        style={[
          styles.tabBar,
          {
            borderColor: sidebarBorder,
            shadowColor: "#000",
          },
        ]}
      >
        <TabBarBackdrop
          liquidGlassIsAvailable={liquidGlassIsAvailable}
          sidebar={sidebar}
        />
        {state.routes.map((route, index) => {
          const options = descriptors[route.key]?.options;
          const isFocused = state.index === index;
          const color = isFocused ? sidebarActiveColor : sidebarInactiveColor;

          return (
            <TabBarButton
              color={color}
              href={getTabHref(route.name)}
              isFocused={isFocused}
              key={route.key}
              navigation={navigation}
              options={options}
              primary={primary}
              primaryForeground={primaryForeground}
              route={route}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  createTab: {
    alignItems: "center",
    borderRadius: 999,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  tabBar: {
    alignItems: "center",
    borderRadius: 999,
    borderWidth: 1,
    elevation: 12,
    flexDirection: "row",
    gap: 8,
    height: TAB_BAR_HEIGHT,
    justifyContent: "center",
    overflow: "hidden",
    paddingHorizontal: 8,
    shadowOffset: { height: 8, width: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
  },
  tabBarFrame: {
    alignItems: "center",
    left: 0,
    position: "absolute",
    right: 0,
    zIndex: 50,
  },
  tabBarItem: {
    alignItems: "center",
    borderRadius: 999,
    height: 52,
    justifyContent: "center",
    width: 52,
  },
});
