import type { LegendListRenderItemProps } from "@legendapp/list";
import { Pressable, View } from "react-native";
import { useRouter } from "expo-router";

import type { UIProfile } from "@acme/convex/types";

import { Name } from "../atoms/name";
import { PFP } from "../atoms/pfp";
import { Username } from "../atoms/username";
import { ProfileStore } from "../store";

function ProfileSearchItem({ item }: LegendListRenderItemProps<UIProfile>) {
  const router = useRouter();

  return (
    <ProfileStore profile={item}>
      <Pressable
        onPress={() => router.push(`/search/${item.username}`)}
        className="active:bg-muted/50 flex-row items-center gap-3 px-4 py-3"
      >
        <PFP variant="sm" />
        <View className="flex-1">
          <Name className="text-base" />
          <Username className="text-foreground text-sm" />
        </View>
      </Pressable>
    </ProfileStore>
  );
}

export { ProfileSearchItem };
