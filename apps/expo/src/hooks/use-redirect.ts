import { useRouter } from "expo-router";

import * as Auth from "~/features/auth/atom";

function useRedirect() {
  const router = useRouter();
  const imNotSignedIn = Auth.useStore((s) => s.imSignedIn === false);
  const setRedirectURL = Auth.useStore((s) => s.setRedirectURL);
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

export { useRedirect };
