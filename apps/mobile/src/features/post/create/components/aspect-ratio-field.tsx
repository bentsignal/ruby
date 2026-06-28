import { Pressable, Text, View } from "react-native";

import type { PostDisplayAspectRatio } from "@acme/config/posts";
import {
  getPostDisplayAspectRatioValue,
  POST_DISPLAY_ASPECT_RATIOS,
} from "@acme/config/posts";
import { cn } from "@acme/std/cn";

import { useCreateStore } from "../store";

export function AspectRatioField() {
  const displayAspectRatio = useCreateStore(
    (store) => store.displayAspectRatio,
  );
  const itemCount = useCreateStore((store) => store.items.length);
  const setDisplayAspectRatio = useCreateStore(
    (store) => store.setDisplayAspectRatio,
  );

  if (itemCount <= 1) return null;

  return (
    <View className="gap-2 px-2">
      <Text className="text-foreground text-sm font-bold">Post shape</Text>
      <View className="flex-row gap-2">
        {POST_DISPLAY_ASPECT_RATIOS.map((ratio) => (
          <AspectRatioOption
            isSelected={displayAspectRatio === ratio}
            key={ratio}
            ratio={ratio}
            onPress={() => setDisplayAspectRatio(ratio)}
          />
        ))}
      </View>
    </View>
  );
}

function AspectRatioOption({
  isSelected,
  ratio,
  onPress,
}: {
  isSelected: boolean;
  ratio: PostDisplayAspectRatio;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={cn(
        "border-border bg-card min-h-24 flex-1 items-center justify-center gap-2 rounded-lg border p-2",
        isSelected && "border-primary bg-primary/10",
      )}
      onPress={onPress}
    >
      <View
        className={cn(
          "border-muted-foreground/40 bg-muted/70 items-center justify-center rounded-sm border",
          isSelected && "border-primary/70 bg-primary/15",
        )}
        style={getShapeStyle(ratio)}
      >
        <View className="bg-background/80 size-1.5 rounded-full" />
      </View>
      <Text
        className={cn(
          "text-muted-foreground text-xs font-black",
          isSelected && "text-primary",
        )}
      >
        {ratio}
      </Text>
    </Pressable>
  );
}

function getShapeStyle(ratio: PostDisplayAspectRatio) {
  const width = 48;
  const height = width / getPostDisplayAspectRatioValue(ratio);
  return { height, width };
}
