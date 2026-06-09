import { useEffect } from "react";
import { usePathname, useRouter } from "expo-router";

import { useAuthStore } from "~/features/auth/store";

export function useRedirectIfSignedIn() {
  const imSignedIn = useAuthStore((s) => s.imSignedIn);
  const myProfile = useAuthStore((s) => s.myProfile);
  const waitlistStatus = useAuthStore((s) => s.waitlistStatus);
  const waitlistStatusIsLoaded = useAuthStore((s) => s.waitlistStatusIsLoaded);
  const hasAccess = waitlistStatus === "has-access";

  const pathname = usePathname();
  const router = useRouter();

  // eslint-disable-next-line no-restricted-syntax -- Expo Router navigation must react to authentication changes.
  useEffect(() => {
    if (!imSignedIn) {
      if (pathname === "/waitlist") {
        router.replace("/login");
      }
      return;
    }

    if (!myProfile || !waitlistStatusIsLoaded) {
      return;
    }

    if (hasAccess) {
      router.replace("/home");
      return;
    }

    if (pathname !== "/waitlist") {
      router.replace("/waitlist");
      return;
    }
  }, [
    hasAccess,
    imSignedIn,
    myProfile,
    pathname,
    router,
    waitlistStatusIsLoaded,
  ]);
}
