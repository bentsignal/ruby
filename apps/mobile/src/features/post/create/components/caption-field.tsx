import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { POST_CAPTION_MAX_LENGTH } from "@acme/config/posts";

import { useCreateStore } from "../store";

const CAPTION_STORE_WRITE_DELAY_MS = 180;

export function CaptionField({ onFocus }: { onFocus?: () => void }) {
  const caption = useCreateStore((store) => store.caption);
  const mutedForeground = useCreateStore((store) => store.mutedForeground);
  const setCaption = useCreateStore((store) => store.setCaption);
  const setCaptionDraft = useCreateStore((store) => store.setCaptionDraft);
  const [captionLength, setCaptionLength] = useState(caption.length);
  const latestCaptionRef = useRef(caption);
  const storeWriteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  // eslint-disable-next-line no-restricted-syntax -- Clears a pending deferred store write if this native input unmounts.
  useEffect(() => {
    return () => {
      if (storeWriteTimeoutRef.current) {
        clearTimeout(storeWriteTimeoutRef.current);
      }
    };
  }, []);

  function flushCaptionToStore() {
    if (storeWriteTimeoutRef.current) {
      clearTimeout(storeWriteTimeoutRef.current);
      storeWriteTimeoutRef.current = null;
    }
    setCaption(latestCaptionRef.current);
  }

  function handleChangeText(nextCaption: string) {
    latestCaptionRef.current = nextCaption;
    setCaptionDraft(nextCaption);
    setCaptionLength(nextCaption.length);

    if (storeWriteTimeoutRef.current) {
      clearTimeout(storeWriteTimeoutRef.current);
    }
    storeWriteTimeoutRef.current = setTimeout(() => {
      storeWriteTimeoutRef.current = null;
      setCaption(latestCaptionRef.current);
    }, CAPTION_STORE_WRITE_DELAY_MS);
  }

  return (
    <View className="gap-2">
      <Text className="text-foreground text-sm font-bold">Caption</Text>
      <TextInput
        className="bg-card border-border text-foreground min-h-40 rounded-lg border p-4 text-base leading-6"
        defaultValue={caption}
        maxLength={POST_CAPTION_MAX_LENGTH}
        multiline
        placeholder="Add a caption..."
        placeholderTextColor={mutedForeground}
        textAlignVertical="top"
        onBlur={flushCaptionToStore}
        onChangeText={handleChangeText}
        onFocus={onFocus}
      />
      <Text className="text-muted-foreground self-end text-xs">
        {captionLength}/{POST_CAPTION_MAX_LENGTH}
      </Text>
    </View>
  );
}
