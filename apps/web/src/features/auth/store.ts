import { useRouteContext } from "@tanstack/react-router";
import { createStore } from "rostra";

import { useLoading } from "@acme/std/use-loading";
import { toast } from "@acme/ui-web/toast";

import { urls } from "~/urls";
import { authClient } from "./lib/client";

function useInternalStore() {
  const { isLoading, run } = useLoading();
  const isAuthenticated = useRouteContext({
    from: "__root__",
    select: (ctx) => ctx.isAuthenticated,
  });

  function signInWithGoogle(redirectUri?: string) {
    if (isAuthenticated) return;
    void run({
      fn: async () => {
        const callbackUrl = new URL("/auth/callback", urls.web);
        callbackUrl.searchParams.set("redirect_uri", redirectUri ?? "/");

        await authClient.signIn.social({
          provider: "google",
          callbackURL: callbackUrl.toString(),
        });
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to sign in with Google");
      },
    });
  }

  function signOut() {
    if (!isAuthenticated) return;
    void run({
      fn: async () => {
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
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to sign out");
      },
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
