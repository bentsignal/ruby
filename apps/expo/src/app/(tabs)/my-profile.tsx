import { useRequiredContext } from "@acme/context";

import * as Auth from "~/features/auth/atom";
import { AccountNotFound } from "~/features/profile/screens/account-not-found";
import { DefaultProfile } from "~/features/profile/screens/default-profile";
import { MyProfileNotSignedIn } from "~/features/profile/screens/my-profile-not-signed-in";
import { ProfileLoading } from "~/features/profile/screens/profile-loading";

export default function MyProfile() {
  useRequiredContext(Auth.Context);

  const imNotSignedIn = Auth.useContext((c) => c.imSignedIn === false);
  const myProfile = Auth.useContext((c) => c.myProfile);

  if (imNotSignedIn) {
    return <MyProfileNotSignedIn />;
  }

  if (myProfile === null) {
    return <ProfileLoading />;
  }

  if (myProfile === undefined) {
    return <AccountNotFound />;
  }

  return <DefaultProfile profile={myProfile} />;
}
