import { Text, TextInput, View } from "react-native";

import { useCaptionField } from "../hooks/use-caption-field";
import { useCreateStore } from "../store";

export function CaptionField({ onFocus }: { onFocus?: () => void }) {
  const caption = useCreateStore((store) => store.caption);
  const mutedForeground = useCreateStore((store) => store.mutedForeground);
  const resetKey = useCreateStore((store) => store.resetKey);
  const setCaption = useCreateStore((store) => store.setCaption);
  const setCaptionDraft = useCreateStore((store) => store.setCaptionDraft);
  const captionField = useCaptionField({
    caption,
    resetKey,
    setCaption,
    setCaptionDraft,
  });

  return (
    <View className="gap-2">
      <Text className="text-foreground text-sm font-bold">Caption</Text>
      <TextInput
        key={captionField.resetKey}
        className="bg-card border-border text-foreground min-h-40 rounded-lg border p-4 text-base leading-6"
        defaultValue={captionField.defaultValue}
        maxLength={captionField.maxLength}
        multiline
        placeholder="Add a caption..."
        placeholderTextColor={mutedForeground}
        textAlignVertical="top"
        onBlur={captionField.onBlur}
        onChangeText={captionField.onChangeText}
        onFocus={onFocus}
      />
      <Text className="text-muted-foreground self-end text-xs">
        {captionField.length}/{captionField.maxLength}
      </Text>
    </View>
  );
}
