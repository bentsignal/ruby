import { FriendsButton } from "./friends-button";
import { FriendsButtonStore } from "./store";

function Wrapper({ className }: { className?: string }) {
  return (
    <FriendsButtonStore>
      <FriendsButton className={className} />
    </FriendsButtonStore>
  );
}

export { Wrapper as FriendsButton };
