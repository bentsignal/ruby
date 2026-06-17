import type { Dispatch, SetStateAction } from "react";
import { useState } from "react";

import type { ResolvedLocation } from "@acme/convex/places/types";

import type { ComposerItem } from "../types";
import { resetCaptionDraft } from "../lib/caption-draft";

export function useComposerReset({
  setCaptionState,
  setError,
  setItems,
  setLocation,
}: {
  setCaptionState: (caption: string) => void;
  setError: (error: string | null) => void;
  setItems: Dispatch<SetStateAction<ComposerItem[]>>;
  setLocation: (location: ResolvedLocation | null) => void;
}) {
  const [resetKey, setResetKey] = useState(0);

  function resetComposer() {
    resetCaptionDraft();
    setItems([]);
    setCaptionState("");
    setError(null);
    setLocation(null);
    setResetKey((current) => current + 1);
  }

  return { resetComposer, resetKey };
}
