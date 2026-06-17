import { useEffect, useRef, useState } from "react";
import { Text, TextInput, View } from "react-native";

import { POST_CAPTION_MAX_LENGTH } from "@acme/config/posts";

import { useCreateStore } from "../store";

const CAPTION_STORE_WRITE_DELAY_MS = 180;

export function CaptionField({ onFocus }: { onFocus?: () => void }) {
  const caption = useCreateStore((store) => store.caption);
  const mutedForeground = useCreateStore((store) => store.mutedForeground);
  const resetKey = useCreateStore((store) => store.resetKey);
  const setCaption = useCreateStore((store) => store.setCaption);
  const setCaptionDraft = useCreateStore((store) => store.setCaptionDraft);
  const [inputState, setInputState] = useState({
    length: caption.length,
    resetKey,
  });
  const latestCaptionRef = useRef(caption);
  const storeWriteTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  if (inputState.resetKey !== resetKey) {
    setInputState({ length: caption.length, resetKey });
  }

  // eslint-disable-next-line no-restricted-syntax -- Clears a pending deferred store write if this native input unmounts.
  useEffect(() => {
    return () => {
      if (storeWriteTimeoutRef.current) {
        clearTimeout(storeWriteTimeoutRef.current);
      }
    };
  }, []);

  // eslint-disable-next-line no-restricted-syntax -- Keeps the deferred native input value aligned after composer resets.
  useEffect(() => {
    latestCaptionRef.current = caption;
  }, [caption, resetKey]);

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
    setInputState({ length: nextCaption.length, resetKey });

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
        key={resetKey}
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
        {inputState.length}/{POST_CAPTION_MAX_LENGTH}
      </Text>
    </View>
  );
}
