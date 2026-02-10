import { useProfileStore } from "../store";
import { AddFriendButton } from "./add-friend-button";
import { EditProfileButton } from "./edit-profile-button";
import { FriendsButton } from "./friends-button";
import { IncomingRequestButton } from "./incoming-request-button";
import { OutgoingRequestButton } from "./outgoing-request-button";

function PrimaryButton({ className }: { className?: string }) {
  const relationship = useProfileStore((s) => s.relationship);
  if (relationship === undefined) return null;
  if (relationship === "my-profile") {
    return <EditProfileButton className={className} />;
  }
  if (relationship === "pending-incoming") {
    return <IncomingRequestButton className={className} />;
  }
  if (relationship === "pending-outgoing") {
    return <OutgoingRequestButton className={className} />;
  }
  if (relationship === "friends") {
    return <FriendsButton className={className} />;
  }
  return <AddFriendButton className={className} />;
}

export { PrimaryButton };
