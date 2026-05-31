import { useEffect } from "react";
import { useRouter } from "expo-router";

import { useAuthStore } from "~/features/auth/store";

export function useRedirectIfSignedIn() {
  const imSignedIn = useAuthStore((s) => s.imSignedIn);

  const router = useRouter();

  // eslint-disable-next-line no-restricted-syntax -- Expo Router navigation must react to authentication changes.
  useEffect(() => {
    if (imSignedIn && router.canGoBack()) {
      router.back();
      return;
    }
    if (imSignedIn) {
      return;
    }
  }, [imSignedIn, router]);
}
