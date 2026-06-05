import type { Tabs } from "expo-router";
import type { ComponentProps } from "react";

export type MobileTabBarProps = Parameters<
  NonNullable<ComponentProps<typeof Tabs>["tabBar"]>
>[0];

export type TabBarRoute = MobileTabBarProps["state"]["routes"][number];
export type TabBarNavigation = MobileTabBarProps["navigation"];
export type TabBarOptions = MobileTabBarProps["descriptors"][string]["options"];
