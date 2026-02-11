import { Link } from "@tanstack/react-router";

import { SignOutLink } from "~/features/auth/atoms/sign-out-link";
import { TakeMeToLoginLink } from "~/features/auth/atoms/take-me-to-login-link";
import { useAuthStore } from "~/features/auth/store";
import { Name } from "../atoms/name";
import { PFP } from "../atoms/pfp";
import { Username } from "../atoms/username";
import { ProfileStore } from "../store";

function SmallProfilePreview() {
  const myProfile = useAuthStore((s) => s.myProfile);
  const imNotSignedIn = useAuthStore((s) => s.imSignedIn === false);

  if (imNotSignedIn || !myProfile) {
    return <TakeMeToLoginLink />;
  }

  return (
    <div className="flex flex-col items-start gap-2">
      <ProfileStore profile={myProfile}>
        <Link
          to="/$username"
          params={{ username: myProfile.username }}
          preload="intent"
          className="cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <PFP variant="sm" className="cursor-pointer" />
            <div className="flex flex-col">
              <Name className="text-sm font-bold" />
              <Username className="text-muted-foreground text-sm font-semibold" />
            </div>
          </div>
        </Link>
      </ProfileStore>
      <SignOutLink />
    </div>
  );
}

export { SmallProfilePreview };
