import { useSyncExternalStore } from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1280;

function getScreenSize(width: number) {
  if (width < MOBILE_BREAKPOINT) return "mobile" as const;
  if (width < TABLET_BREAKPOINT) return "tablet" as const;
  return "desktop" as const;
}

let cachedSnapshot:
  | {
      px: number;
      closestTo: ReturnType<typeof getScreenSize>;
    }
  | undefined;

function getSnapshot() {
  const nextSnapshot = {
    px: window.innerWidth,
    closestTo: getScreenSize(window.innerWidth),
  };

  if (
    cachedSnapshot &&
    cachedSnapshot.px === nextSnapshot.px &&
    cachedSnapshot.closestTo === nextSnapshot.closestTo
  ) {
    return cachedSnapshot;
  }

  cachedSnapshot = nextSnapshot;
  return cachedSnapshot;
}

function subscribe(onStoreChange: () => void) {
  const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
  const tabletMql = window.matchMedia(
    `(max-width: ${TABLET_BREAKPOINT - 1}px)`,
  );
  mql.addEventListener("change", onStoreChange);
  tabletMql.addEventListener("change", onStoreChange);
  window.addEventListener("resize", onStoreChange);
  return () => {
    mql.removeEventListener("change", onStoreChange);
    tabletMql.removeEventListener("change", onStoreChange);
    window.removeEventListener("resize", onStoreChange);
  };
}

function getServerSnapshot() {
  return undefined;
}

export function useScreenSize() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
