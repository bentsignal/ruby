import { useEffect } from "react";
import { useRouter } from "expo-router";

import * as Auth from "~/features/auth/atom";

export const useRedirectIfSignedIn = () => {
  const imSignedIn = Auth.useStore((s) => s.imSignedIn);

  const router = useRouter();

  useEffect(() => {
    if (imSignedIn && router.canGoBack()) {
      router.back();
      return;
    }
    if (imSignedIn) {
      return;
    }
  }, [imSignedIn, router]);
};
