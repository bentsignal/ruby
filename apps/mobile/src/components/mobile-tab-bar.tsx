import { View } from "react-native";
import { isLiquidGlassAvailable } from "expo-glass-effect";

import type { MobileTabBarProps } from "~/components/mobile-tab-bar/types";
import { TabBarBackdrop } from "~/components/mobile-tab-bar/tab-bar-backdrop";
import { TabBarButton } from "~/components/mobile-tab-bar/tab-bar-button";
import { useColor } from "~/hooks/use-color";

const TAB_BAR_SHADOW_STYLE = {
  elevation: 12,
  shadowColor: "#000",
  shadowOffset: { height: 8, width: 0 },
  shadowOpacity: 0.2,
  shadowRadius: 18,
};

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
      className="absolute right-0 left-0 z-50 items-center"
      pointerEvents="box-none"
      style={{ bottom: Math.max(insets.bottom, 12) }}
    >
      <View
        className="h-16 flex-row items-center justify-center gap-2 overflow-hidden rounded-full border px-2"
        style={[{ borderColor: sidebarBorder }, TAB_BAR_SHADOW_STYLE]}
      >
        <TabBarBackdrop
          liquidGlassIsAvailable={liquidGlassIsAvailable}
          sidebar={sidebar}
        />
        {state.routes.map((route, index) => {
          const options = descriptors[route.key]?.options;
          const isFocused = state.index === index;
          const color = getTabColor({
            isFocused,
            sidebarActiveColor,
            sidebarInactiveColor,
          });

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

function getTabColor({
  isFocused,
  sidebarActiveColor,
  sidebarInactiveColor,
}: {
  isFocused: boolean;
  sidebarActiveColor: string;
  sidebarInactiveColor: string;
}) {
  if (isFocused) return sidebarActiveColor;

  return sidebarInactiveColor;
}
