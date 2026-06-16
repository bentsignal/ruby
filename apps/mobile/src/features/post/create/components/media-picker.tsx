import { Pressable, Text, View } from "react-native";
import { ImagePlus } from "lucide-react-native";

import { useCreateStore } from "../store";
import { ManageMediaButton } from "./reorder-media-button";

export function MediaPicker() {
  const hasItems = useCreateStore((store) => store.items.length > 0);

  if (hasItems) {
    return (
      <View className="gap-3 px-2">
        <AddMoreMediaButton />
        <ManageMediaButton />
      </View>
    );
  }

  return (
    <View className="px-2">
      <EmptyMediaPicker />
    </View>
  );
}

export function AddMoreMediaButton() {
  const foreground = useCreateStore((store) => store.foreground);
  const pickFiles = useCreateStore((store) => store.pickFiles);

  return (
    <Pressable
      className="border-border bg-card h-32 items-center justify-center gap-2 rounded-lg border border-dashed"
      onPress={pickFiles}
    >
      <ImagePlus className="size-6" color={foreground} />
      <Text className="text-muted-foreground text-sm font-semibold">
        Add more
      </Text>
    </Pressable>
  );
}

export function EmptyMediaPicker() {
  const foreground = useCreateStore((store) => store.foreground);
  const pickFiles = useCreateStore((store) => store.pickFiles);

  return (
    <Pressable
      className="bg-card border-border min-h-80 items-center justify-center gap-4 overflow-hidden rounded-lg border border-dashed p-6"
      onPress={pickFiles}
    >
      <View className="bg-primary/15 size-16 items-center justify-center rounded-full">
        <ImagePlus className="size-8" color={foreground} />
      </View>
      <Text className="text-foreground text-center text-base font-bold">
        Tap to add photos
      </Text>
    </Pressable>
  );
}
