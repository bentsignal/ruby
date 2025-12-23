import { useEffect } from "react";
import { useRouter } from "expo-router";

import { authClient } from "~/lib/auth-client";

export const useRedirectIfSignedIn = () => {
  const router = useRouter();
  const session = authClient.useSession();
  const imNotSignedIn = session.data === null;

  useEffect(() => {
    if (imNotSignedIn) return;
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace("/(tabs)");
    }
  }, [imNotSignedIn, router]);
};
