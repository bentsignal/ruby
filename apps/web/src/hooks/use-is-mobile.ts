import { useEffect, useState } from "react";

const MOBILE_BREAKPOINT = 1024;

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState<boolean | undefined>(undefined);

  // eslint-disable-next-line no-restricted-syntax -- Tracks viewport changes from the browser media query API.
  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    function onChange() {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    }
    mql.addEventListener("change", onChange);
    // eslint-disable-next-line react-hooks/set-state-in-effect -- Initializes state from the subscribed media query.
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isMobile;
}
