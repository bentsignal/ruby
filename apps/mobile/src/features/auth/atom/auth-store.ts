import { useState } from "react";
import { useRouter } from "expo-router";
import { useConvexAuth, useQuery } from "convex/react";
import { createStore } from "rostra";

import { api } from "@acme/convex/api";

import { authClient } from "~/features/auth/lib/auth-client";
import { useLoading } from "~/hooks/use-loading";

function useInternalStore() {
  const { isLoading, start } = useLoading();
  const router = useRouter();
  const { isAuthenticated: imSignedIn } = useConvexAuth();
  const imSignedOut = !imSignedIn;

  const myProfile = useQuery(api.profile.getMine, imSignedIn ? {} : "skip");

  const [redirectURL, setRedirectURL] = useState("/");

  const signInWithGoogle = () => {
    if (imSignedIn) return;
    start(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: redirectURL,
      });
      setRedirectURL("/");
    });
  };

  const signOut = () => {
    if (imSignedOut) return;
    start(async () => {
      router.replace("/");
      await authClient.signOut();
    });
  };

  return {
    myProfile,
    isLoading,
    imSignedIn,
    signInWithGoogle,
    signOut,
    redirectURL,
    setRedirectURL,
  };
}

export const { Store, useStore } = createStore(useInternalStore);
