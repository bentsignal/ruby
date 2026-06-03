import { useState } from "react";
import { Alert } from "react-native";
import { createStore } from "rostra";

import { useRemoveFriend } from "@acme/features/friends";

import { useProfileStore } from "~/features/profile/store";

function useInternalStore() {
  const [isModalVisible, setModalVisibility] = useState(false);
  const name = useProfileStore((s) => s.name);
  const username = useProfileStore((s) => s.username);
  const removeFriendMutation = useRemoveFriend({ username });

  function removeFriend() {
    setModalVisibility(false);
    Alert.alert(
      `Are you sure you want to unfriend ${name}?`,
      "You'll have to send a new friend request if you change your mind.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            void removeFriendMutation({ username });
          },
        },
      ],
    );
  }
  return { isModalVisible, setModalVisibility, removeFriend };
}

export const { Store: FriendsButtonStore, useStore: useFriendsButtonStore } =
  createStore(useInternalStore);
