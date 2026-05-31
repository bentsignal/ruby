import { FriendsButton } from "./friends-button";
import { FriendsButtonStore } from "./store";

function Wrapper() {
  return (
    <FriendsButtonStore>
      <FriendsButton />
    </FriendsButtonStore>
  );
}

export { Wrapper as FriendsButton };
