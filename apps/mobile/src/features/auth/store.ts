import { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import { useQuery as useTanStackQuery } from "@tanstack/react-query";
/* eslint-disable no-restricted-imports -- Startup auth gating must avoid the TanStack Convex adapter path that intermittently leaves waitlist status fetching forever on mobile. */
import {
  useConvexAuth,
  useQuery as useConvexQuery,
  useMutation,
} from "convex/react";
/* eslint-enable no-restricted-imports */
import { ConvexError } from "convex/values";
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

  const profileBootstrapQuery = useTanStackQuery({
    queryKey: ["auth", "profile"],
    queryFn: async () => await ensureProfileExists(),
    enabled: imSignedIn,
    select: (profile) => profile,
  });
  const myProfile = useConvexQuery(
    api.profile.queries.getMine,
    imSignedIn && profileBootstrapQuery.isSuccess ? {} : "skip",
  );
  const waitlistStatusQueryEnabled = imSignedIn && !!myProfile;
  const waitlistStatus = useConvexQuery(
    api.waitlist.queries.getMyStatus,
    waitlistStatusQueryEnabled ? {} : "skip",
  );
  const waitlistStatusIsLoaded =
    waitlistStatusQueryEnabled && waitlistStatus !== undefined;

  const [redirectURL, setRedirectURL] = useState("/");

  // eslint-disable-next-line no-restricted-syntax -- Recover stale local auth tokens that Convex no longer accepts.
  useEffect(() => {
    if (!imSignedIn) return;
    const authError =
      profileBootstrapQuery.error instanceof ConvexError
        ? profileBootstrapQuery.error
        : undefined;
    if (authError?.data !== "Unauthenticated") return;

    router.replace("/login");
    void authClient.signOut();
  }, [imSignedIn, profileBootstrapQuery.error, router]);

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
    waitlistStatus,
    waitlistStatusIsLoaded,
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
