import { useProfileStore } from "~/features/profile/store";
import { AddFriendButton } from "./add-friend-button";
import { FriendsButton } from "./friends-button";
import { IncomingRequestButton } from "./incoming-request-button";
import { MyProfileButtons } from "./my-profile-buttons";
import { OutgoingRequestButton } from "./outgoing-request-button";

export function PrimaryButton({ className }: { className?: string }) {
  const relationship = useProfileStore((s) => s.relationship);
  if (relationship === undefined) return null;
  switch (relationship) {
    case "my-profile":
      return <MyProfileButtons className={className} />;
    case "pending-incoming":
      return <IncomingRequestButton className={className} />;
    case "pending-outgoing":
      return <OutgoingRequestButton className={className} />;
    case "friends":
      return <FriendsButton />;
    case null:
      return <AddFriendButton className={className} />;
  }
}
