import { Pressable, Text, TextInput, View } from "react-native";
import { Plus } from "lucide-react-native";

export function CreateFooter({
  caption,
  error,
  foreground,
  hasItems,
  mutedForeground,
  onAddMedia,
  setCaption,
}: {
  caption: string;
  error: string | null;
  foreground: string;
  hasItems: boolean;
  mutedForeground: string;
  onAddMedia: () => void;
  setCaption: (caption: string) => void;
}) {
  return (
    <View className="gap-5 px-2 pt-3">
      <AddMoreMediaButton
        foreground={foreground}
        hasItems={hasItems}
        onPress={onAddMedia}
      />
      <CaptionInput
        caption={caption}
        mutedForeground={mutedForeground}
        setCaption={setCaption}
      />
      <ErrorMessage error={error} />
    </View>
  );
}

function AddMoreMediaButton({
  foreground,
  hasItems,
  onPress,
}: {
  foreground: string;
  hasItems: boolean;
  onPress: () => void;
}) {
  if (!hasItems) return null;

  return (
    <Pressable
      className="border-border bg-card h-32 items-center justify-center gap-2 rounded-lg border border-dashed"
      onPress={onPress}
    >
      <Plus className="size-6" color={foreground} />
      <Text className="text-muted-foreground text-sm font-semibold">
        Add more
      </Text>
    </Pressable>
  );
}

function CaptionInput({
  caption,
  mutedForeground,
  setCaption,
}: {
  caption: string;
  mutedForeground: string;
  setCaption: (caption: string) => void;
}) {
  return (
    <View className="gap-2">
      <Text className="text-foreground text-sm font-bold">Caption</Text>
      <TextInput
        className="bg-card border-border text-foreground min-h-40 rounded-lg border p-4 text-base leading-6"
        maxLength={2200}
        multiline
        placeholder="Tell the story behind this stop."
        placeholderTextColor={mutedForeground}
        textAlignVertical="top"
        value={caption}
        onChangeText={setCaption}
      />
      <Text className="text-muted-foreground self-end text-xs">
        {caption.length}/2200
      </Text>
    </View>
  );
}

function ErrorMessage({ error }: { error: string | null }) {
  if (!error) return null;

  return <Text className="text-destructive text-sm">{error}</Text>;
}
