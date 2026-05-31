import { useRouter } from "expo-router";

import { useAuthStore } from "~/features/auth/store";

export function useRedirect() {
  const router = useRouter();
  const imNotSignedIn = useAuthStore((s) => s.imSignedIn === false);
  const setRedirectURL = useAuthStore((s) => s.setRedirectURL);
  function redirectIfNotSignedIn({
    redirectURL,
    ifSignedIn,
  }: {
    redirectURL?: string;
    ifSignedIn: () => void;
  }) {
    if (imNotSignedIn) {
      setRedirectURL(redirectURL ?? "/");
      router.push("/login");
      return;
    }
    ifSignedIn();
  }
  return { redirectIfNotSignedIn };
}
