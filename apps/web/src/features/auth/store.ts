import { useConvexAuth, useQuery } from "convex/react";
import { createStore } from "rostra";

import { api } from "@acme/convex/api";
import { toast } from "@acme/ui/toast";

import { useLoading } from "~/hooks/use-loading";
import { urls } from "~/urls";
import { authClient } from "./lib/client";

function useInternalStore() {
  const { isLoading, start } = useLoading();
  const { isAuthenticated } = useConvexAuth();

  const myProfile = useQuery(
    api.profile.getMine,
    isAuthenticated ? undefined : "skip",
  );

  const signInWithGoogle = (redirectUri?: string) => {
    if (isAuthenticated) return;
    start(async () => {
      const callbackUrl = new URL("/auth/callback", urls.web);
      callbackUrl.searchParams.set("redirect_uri", redirectUri ?? "/");

      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl.toString(),
      });
    });
  };

  const signOut = () => {
    if (!isAuthenticated) return;
    start(async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            window.location.replace("/login");
          },
          onError: (error: unknown) => {
            console.error(error);
            toast.error("Failed to sign out");
          },
        },
      });
    });
  };

  return {
    myProfile,
    isLoading,
    imSignedIn: isAuthenticated,
    imSignedOut: !isAuthenticated,
    signInWithGoogle,
    signOut,
  };
}

export const { Store: AuthStore, useStore: useAuthStore } =
  createStore(useInternalStore);
