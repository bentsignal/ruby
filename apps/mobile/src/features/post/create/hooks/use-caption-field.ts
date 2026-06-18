import type { MutableRefObject } from "react";
import { useEffect, useRef, useState } from "react";

import { POST_CAPTION_MAX_LENGTH } from "@acme/config/posts";

const CAPTION_STORE_WRITE_DELAY_MS = 180;

export function useCaptionField({
  caption,
  resetKey,
  setCaption,
  setCaptionDraft,
}: {
  caption: string;
  resetKey: number;
  setCaption: (caption: string) => void;
  setCaptionDraft: (caption: string) => void;
}) {
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
      clearStoreWriteTimeout(storeWriteTimeoutRef);
    };
  }, []);

  // eslint-disable-next-line no-restricted-syntax -- Keeps the deferred native input value aligned after composer resets.
  useEffect(() => {
    latestCaptionRef.current = caption;
  }, [caption, resetKey]);

  function flushCaptionToStore() {
    clearStoreWriteTimeout(storeWriteTimeoutRef);
    setCaption(latestCaptionRef.current);
  }

  function handleChangeText(nextCaption: string) {
    latestCaptionRef.current = nextCaption;
    setCaptionDraft(nextCaption);
    setInputState({ length: nextCaption.length, resetKey });

    clearStoreWriteTimeout(storeWriteTimeoutRef);
    storeWriteTimeoutRef.current = setTimeout(() => {
      storeWriteTimeoutRef.current = null;
      setCaption(latestCaptionRef.current);
    }, CAPTION_STORE_WRITE_DELAY_MS);
  }

  return {
    defaultValue: caption,
    length: inputState.length,
    maxLength: POST_CAPTION_MAX_LENGTH,
    onBlur: flushCaptionToStore,
    onChangeText: handleChangeText,
    resetKey,
  };
}

function clearStoreWriteTimeout(
  timeoutRef: MutableRefObject<ReturnType<typeof setTimeout> | null>,
) {
  if (!timeoutRef.current) return;
  clearTimeout(timeoutRef.current);
  timeoutRef.current = null;
}
