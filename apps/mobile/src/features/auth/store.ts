import { useState } from "react";
import { useRouter } from "expo-router";
// eslint-disable-next-line no-restricted-imports -- Mobile auth state is client-only, so it cannot be route-preloaded.
import { useQuery } from "@tanstack/react-query";
import { convexQuery } from "@convex-dev/react-query";
import { useConvexAuth, useMutation } from "convex/react";
import { createStore } from "rostra";

import { api } from "@acme/convex/api";
import { useLoading } from "@acme/std/use-loading";

import { authClient } from "~/features/auth/lib/auth-client";

function useInternalStore() {
  const { isLoading, run } = useLoading();
  const router = useRouter();
  const { isAuthenticated: imSignedIn, isLoading: authIsLoading } =
    useConvexAuth();
  const imSignedOut = !authIsLoading && !imSignedIn;
  const ensureProfileExists = useMutation(
    api.profile.mutations.ensureProfileExists,
  );

  const { data: myProfile } = useQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => await ensureProfileExists(),
    enabled: imSignedIn,
    select: (profile) => profile,
  });
  const waitlistStatusQuery = useQuery({
    ...convexQuery(api.waitlist.queries.getMyStatus, {}),
    enabled: imSignedIn && !!myProfile,
    select: (status) => status,
  });

  const [redirectURL, setRedirectURL] = useState("/");

  function signInWithGoogle() {
    if (imSignedIn) return;
    void run({
      fn: async () => {
        await authClient.signIn.social({
          provider: "google",
          callbackURL: redirectURL,
        });
        setRedirectURL("/");
      },
      onError: (error) => {
        console.error(error);
      },
    });
  }

  function signOut() {
    if (imSignedOut) return;
    void run({
      fn: async () => {
        router.replace("/");
        await authClient.signOut();
      },
      onError: (error) => {
        console.error(error);
      },
    });
  }

  return {
    myProfile,
    waitlistStatus: waitlistStatusQuery.data,
    waitlistStatusIsLoaded: waitlistStatusQuery.status === "success",
    isLoading,
    authIsLoading,
    imSignedIn,
    signInWithGoogle,
    signOut,
    redirectURL,
    setRedirectURL,
  };
}

export const { Store: AuthStore, useStore: useAuthStore } =
  createStore(useInternalStore);
