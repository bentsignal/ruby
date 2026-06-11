import { useAuthStore } from "~/features/auth/store";

export const AUTH_DESTINATION = {
  home: "/home",
  login: "/login",
  pending: "pending",
  waitlist: "/waitlist",
} as const;

export function useAuthDestination() {
  const authIsLoading = useAuthStore((s) => s.authIsLoading);
  const imSignedIn = useAuthStore((s) => s.imSignedIn);
  const myProfile = useAuthStore((s) => s.myProfile);
  const waitlistStatus = useAuthStore((s) => s.waitlistStatus);
  const waitlistStatusIsLoaded = useAuthStore((s) => s.waitlistStatusIsLoaded);

  if (authIsLoading) return AUTH_DESTINATION.pending;
  if (!imSignedIn) return AUTH_DESTINATION.login;
  if (!myProfile || !waitlistStatusIsLoaded) return AUTH_DESTINATION.pending;
  return waitlistStatus === "has-access"
    ? AUTH_DESTINATION.home
    : AUTH_DESTINATION.waitlist;
}
