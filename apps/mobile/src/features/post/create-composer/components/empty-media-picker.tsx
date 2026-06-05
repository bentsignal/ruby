import { Pressable, Text, View } from "react-native";
import { ImagePlus } from "lucide-react-native";

export function EmptyMediaPicker({
  foreground,
  onPress,
}: {
  foreground: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      className="bg-card border-border min-h-80 items-center justify-center gap-4 overflow-hidden rounded-lg border border-dashed p-6"
      onPress={onPress}
    >
      <View className="bg-primary/15 size-16 items-center justify-center rounded-full">
        <ImagePlus className="size-8" color={foreground} />
      </View>
      <Text className="text-foreground text-center text-base font-bold">
        Tap to add photos or videos
      </Text>
    </Pressable>
  );
}
