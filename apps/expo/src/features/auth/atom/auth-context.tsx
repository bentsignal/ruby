import type { ReactNode } from "react";
import { useConvexAuth, useQuery } from "convex/react";

import type { Doc } from "@acme/convex/model";
import { createContext } from "@acme/context";
import { api } from "@acme/convex/api";

import { authClient } from "~/features/auth/lib/auth-client";
import { useLoading } from "~/hooks/use-loading";

const { Context, useContext } = createContext<{
  myProfile: Doc<"profiles"> | undefined | null;
  isLoading: boolean;
  imSignedIn: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}>({
  displayName: "AuthContext",
});

const Provider = ({ children }: { children: ReactNode }) => {
  const { isLoading, start } = useLoading();

  const { isAuthenticated: imSignedIn } = useConvexAuth();
  const imSignedOut = !imSignedIn;

  const myProfile = useQuery(
    api.profile.getMyProfile,
    imSignedIn ? {} : "skip",
  );

  const signInWithGoogle = () => {
    if (imSignedIn) return;
    start(async () => {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    });
  };

  const signOut = () => {
    if (imSignedOut) return;
    start(async () => {
      await authClient.signOut();
    });
  };

  return (
    <Context.Provider
      value={{
        myProfile,
        isLoading,
        imSignedIn,
        signInWithGoogle,
        signOut,
      }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, useContext, Provider };
