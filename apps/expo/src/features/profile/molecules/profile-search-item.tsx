import type { LegendListRenderItemProps } from "@legendapp/list";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import type { UIProfile } from "@acme/convex/types";

import * as Profile from "../atom";

function ProfileSearchItem({ item }: LegendListRenderItemProps<UIProfile>) {
  const router = useRouter();

  return (
    <Profile.Store profile={item}>
      <Pressable
        onPress={() => router.push(`/${item.username}`)}
        className="active:bg-muted/50 flex-row items-center gap-3 px-4 py-3"
      >
        <Profile.PFP variant="sm" />
        <View className="flex-1">
          <Profile.Name className="text-base" />
          <Profile.Username className="text-foreground text-sm" />
        </View>
      </Pressable>
    </Profile.Store>
  );
}

export { ProfileSearchItem };
