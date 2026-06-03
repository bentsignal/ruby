import { useSyncExternalStore } from "react";

function getSnapshot() {
  const canHover = window.matchMedia("(hover: hover)").matches;
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  if (!canHover || isCoarse) {
    return "touch" as const;
  }

  return "mouse" as const;
}

function subscribe(onStoreChange: () => void) {
  const hoverMediaQuery = window.matchMedia("(hover: hover)");
  const coarsePointerMediaQuery = window.matchMedia("(pointer: coarse)");

  hoverMediaQuery.addEventListener("change", onStoreChange);
  coarsePointerMediaQuery.addEventListener("change", onStoreChange);

  return () => {
    hoverMediaQuery.removeEventListener("change", onStoreChange);
    coarsePointerMediaQuery.removeEventListener("change", onStoreChange);
  };
}

function getServerSnapshot() {
  return undefined;
}

export function useScreenType() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
