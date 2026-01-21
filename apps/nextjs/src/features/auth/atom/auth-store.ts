"use client";

import { useEffect, useState } from "react";
import { useConvexAuth, useQuery } from "convex/react";
import { createStore } from "rostra";

import { api } from "@acme/convex/api";

import { useLoading } from "~/hooks/use-loading";
import { authClient } from "../../../lib/auth-client";

function useInternalStore({
  isAuthenticatedServerSide,
}: {
  isAuthenticatedServerSide: boolean;
}) {
  const { isLoading, start } = useLoading();

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // use serverside auth value until client is mounted
  const { isAuthenticated: isAuthenticatedClientSide } = useConvexAuth();
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setMounted(true);
    }, 1000);
  }, []);

  const imSignedIn = mounted
    ? isAuthenticatedClientSide
    : isAuthenticatedServerSide;
  const imSignedOut = !imSignedIn;

  const myProfile = useQuery(api.profile.getMine, imSignedIn ? {} : "skip");

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

  return {
    myProfile,
    isLoading,
    imSignedIn,
    imSignedOut,
    signInWithGoogle,
    signOut,
    isLoginModalOpen,
    setIsLoginModalOpen,
  };
}

export const { Store, useStore } = createStore(useInternalStore);
