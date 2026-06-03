import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1280;

function getScreenSize(width: number) {
  if (width < MOBILE_BREAKPOINT) return "mobile" as const;
  if (width < TABLET_BREAKPOINT) return "tablet" as const;
  return "desktop" as const;
}

function getSnapshot() {
  const size = {
    px: window.innerWidth,
    closestTo: getScreenSize(window.innerWidth),
  };
  return size;
}

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const tabletMql = window.matchMedia(
    `(max-width: ${TABLET_BREAKPOINT - 1}px)`,
  );
  mql.addEventListener("change", onStoreChange);
  tabletMql.addEventListener("change", onStoreChange);
  return () => {
    mql.removeEventListener("change", onStoreChange);
    tabletMql.removeEventListener("change", onStoreChange);
  };
}

function getServerSnapshot() {
  return undefined;
}

export function useScreenSize() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
