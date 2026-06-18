import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import type { ComposerItem } from "../types";
import { resetCaptionDraft } from "../lib/caption-draft";

export function useComposerReset({
  resetLocation,
  setCaptionState,
  setItems,
}: {
  resetLocation: () => void;
  setCaptionState: (caption: string) => void;
  setItems: Dispatch<SetStateAction<ComposerItem[]>>;
}) {
  const [resetKey, setResetKey] = useState(0);

  function resetComposer() {
    resetCaptionDraft();
    setItems([]);
    setCaptionState("");
    resetLocation();
    setResetKey((current) => current + 1);
  }

  return { resetComposer, resetKey };
}
