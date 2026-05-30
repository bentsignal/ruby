import { useRouteContext } from "@tanstack/react-router";
import { createStore } from "rostra";

import { toast } from "@acme/ui/toast";

import { useLoading } from "~/hooks/use-loading";
import { urls } from "~/urls";
import { authClient } from "./lib/client";

function useInternalStore() {
  const { isLoading, start } = useLoading();
  const isAuthenticated = useRouteContext({
    from: "__root__",
    select: (ctx) => ctx.isAuthenticated,
  });

  function signInWithGoogle(redirectUri?: string) {
    if (isAuthenticated) return;
    start(async () => {
      const callbackUrl = new URL("/auth/callback", urls.web);
      callbackUrl.searchParams.set("redirect_uri", redirectUri ?? "/");

      await authClient.signIn.social({
        provider: "google",
        callbackURL: callbackUrl.toString(),
      });
    });
  }

  function signOut() {
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
  }

  return {
    isLoading,
    imSignedIn: isAuthenticated,
    imSignedOut: !isAuthenticated,
    signInWithGoogle,
    signOut,
  };
}

export const { Store: AuthStore, useStore: useAuthStore } =
  createStore(useInternalStore);
