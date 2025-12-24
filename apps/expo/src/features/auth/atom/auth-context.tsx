import type { ReactNode } from "react";

import { createContext } from "@acme/context";

import { authClient } from "~/features/auth/lib/auth-client";
import { useLoading } from "~/hooks/use-loading";

const { Context, useContext } = createContext<{
  name: string | undefined;
  email: string | undefined;
  isLoading: boolean;
  imSignedIn: boolean;
  signInWithGoogle: () => void;
  signOut: () => void;
}>({
  displayName: "AuthContext",
});

const Provider = ({ children }: { children: ReactNode }) => {
  const { isLoading, start } = useLoading();

  const session = authClient.useSession();
  const name = session.data?.user.name;
  const email = session.data?.user.email;
  const imSignedIn = session.data !== null;
  const imSignedOut = !imSignedIn;

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
      value={{ name, email, isLoading, imSignedIn, signInWithGoogle, signOut }}
    >
      {children}
    </Context.Provider>
  );
};

export { Context, useContext, Provider };
