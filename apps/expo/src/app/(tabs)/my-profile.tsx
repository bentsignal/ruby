import * as Auth from "~/features/auth/atom";
import { ProfileLoading } from "~/features/profile/screens/profile-loading";
import { ProfilePage } from "~/features/profile/screens/profile-page";

export default function MyProfile() {
  const myProfile = Auth.useStore((s) => s.myProfile);
  if (!myProfile) {
    return <ProfileLoading />;
  }

  return <ProfilePage profile={myProfile} relationship={"my-profile"} />;
}
