"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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

  const router = useRouter();
  const searchParams = useSearchParams();
  const showLogin = searchParams.get("showLogin");
  const redirectToFromParams = searchParams.get("redirectTo");

  const [isLoginModalOpen, setIsLoginModalOpen] = useState(
    showLogin === "true",
  );
  const [redirectTo, setRedirectTo] = useState<string | null>(
    redirectToFromParams ?? null,
  );
  const setRedirectURL = (url: string) => setRedirectTo(url);

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
        callbackURL: redirectTo ?? "/",
      });
    });
  };

  const signOut = () => {
    if (imSignedOut) return;
    start(async () => {
      router.push("/");
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
    setRedirectURL,
  };
}

export const { Store, useStore } = createStore(useInternalStore);
