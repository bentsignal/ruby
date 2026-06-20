import { Pressable, View } from "react-native";
import * as Haptics from "expo-haptics";
import { PlusIcon } from "lucide-react-native";

import type { TabBarNavigation, TabBarOptions, TabBarRoute } from "./types";
import { scrollHomeFeedToTop } from "~/features/post/home-feed-scroll";
import { useRedirect } from "~/hooks/use-redirect";

export function TabBarButton({
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
  const onPress = useTabBarPress({ href, isFocused, navigation, route });

  return (
    <Pressable
      accessibilityLabel={options?.tabBarAccessibilityLabel}
      accessibilityRole="button"
      accessibilityState={getAccessibilityState(isFocused)}
      className="h-[52px] w-[52px] items-center justify-center rounded-full"
      onLongPress={() => {
        navigation.emit({
          type: "tabLongPress",
          target: route.key,
        });
      }}
      onPress={onPress}
    >
      <TabBarButtonIcon
        color={color}
        isFocused={isFocused}
        options={options}
        primary={primary}
        primaryForeground={primaryForeground}
        routeName={route.name}
      />
    </Pressable>
  );
}

function TabBarButtonIcon({
  color,
  isFocused,
  options,
  primary,
  primaryForeground,
  routeName,
}: {
  color: string;
  isFocused: boolean;
  options: TabBarOptions | undefined;
  primary: string;
  primaryForeground: string;
  routeName: string;
}) {
  if (routeName === "create") {
    return (
      <View
        className="size-11 items-center justify-center rounded-full"
        style={{ backgroundColor: primary }}
      >
        <PlusIcon color={primaryForeground} size={22} strokeWidth={2} />
      </View>
    );
  }

  return options?.tabBarIcon?.({
    color,
    focused: isFocused,
    size: 24,
  });
}

function useTabBarPress({
  href,
  isFocused,
  navigation,
  route,
}: {
  href: string | undefined;
  isFocused: boolean;
  navigation: TabBarNavigation;
  route: TabBarRoute;
}) {
  const { redirectIfNotSignedIn } = useRedirect();

  return () => {
    void Haptics.selectionAsync();
    redirectIfNotSignedIn({
      redirectURL: href,
      ifSignedIn: () => {
        const event = navigation.emit({
          type: "tabPress",
          target: route.key,
          canPreventDefault: true,
        });

        if (event.defaultPrevented) {
          return;
        }

        if (isFocused && route.name === "(index)") {
          scrollHomeFeedToTop();
          return;
        }

        if (!isFocused) {
          navigation.navigate(route.name, route.params);
        }
      },
    });
  };
}

function getAccessibilityState(isFocused: boolean) {
  if (!isFocused) return {};

  return { selected: true };
}
