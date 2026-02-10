import { Link } from "@tanstack/react-router";

import * as Auth from "~/features/auth/atom";
import { Name } from "../atoms/name";
import { PFP } from "../atoms/pfp";
import { Username } from "../atoms/username";
import { ProfileStore } from "../store";

function SmallProfilePreview() {
  const myProfile = Auth.useStore((s) => s.myProfile);
  const imNotSignedIn = Auth.useStore((s) => s.imSignedIn === false);
  if (imNotSignedIn || !myProfile) {
    return <Auth.TakeMeToLoginLink />;
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
      <Auth.SignOutLink />
    </div>
  );
}

export { SmallProfilePreview };
