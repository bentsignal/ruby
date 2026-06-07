import { Text, TextInput, View } from "react-native";

import { POST_CAPTION_MAX_LENGTH } from "@acme/config/posts";

import { useCreateStore } from "../store";

export function CaptionField() {
  const caption = useCreateStore((store) => store.caption);
  const mutedForeground = useCreateStore((store) => store.mutedForeground);
  const setCaption = useCreateStore((store) => store.setCaption);

  return (
    <View className="gap-2">
      <Text className="text-foreground text-sm font-bold">Caption</Text>
      <TextInput
        className="bg-card border-border text-foreground min-h-40 rounded-lg border p-4 text-base leading-6"
        maxLength={POST_CAPTION_MAX_LENGTH}
        multiline
        placeholder="Tell the story behind this stop."
        placeholderTextColor={mutedForeground}
        textAlignVertical="top"
        value={caption}
        onChangeText={setCaption}
      />
      <Text className="text-muted-foreground self-end text-xs">
        {caption.length}/{POST_CAPTION_MAX_LENGTH}
      </Text>
    </View>
  );
}
