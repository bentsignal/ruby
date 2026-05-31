import { FriendsButton } from "./friends-button";
import { FriendsButtonStore } from "./friends-button-store";

function Wrapper() {
  return (
    <FriendsButtonStore>
      <FriendsButton />
    </FriendsButtonStore>
  );
}

export { Wrapper as FriendsButton };
