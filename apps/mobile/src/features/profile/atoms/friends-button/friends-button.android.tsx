import { useState } from "react";
import { Alert, Modal, Pressable, View } from "react-native";
import { useMutation } from "convex/react";
import { UserRound } from "lucide-react-native";

import { api } from "@acme/convex/api";

import { Button, ButtonText } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";

export function FriendsButton() {
  const [modalVisible, setModalVisible] = useState(false);
  const removeFriend = useMutation(api.friends.remove);
  const name = useProfileStore((s) => s.name);
  const username = useProfileStore((s) => s.username);
  const foreground = useColor("foreground");

  const handleRemoveFriend = () => {
    setModalVisible(false);
    Alert.alert(
      `Are you sure you want to unfriend ${name}?`,
      "You'll have to send a new friend request if you change your mind.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => {
            void removeFriend({ username });
          },
        },
      ],
    );
  };

  return (
    <View className="mx-4">
      <Button
        variant="outline"
        className="w-full"
        onPress={() => setModalVisible(true)}
      >
        <UserRound size={16} color={foreground} />
        <ButtonText variant="outline">Friends</ButtonText>
      </Button>

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => setModalVisible(false)}
        >
          <View className="bg-background mx-8 w-full max-w-sm rounded-2xl p-4">
            <Button
              variant="destructive"
              className="mb-2 w-full"
              onPress={handleRemoveFriend}
            >
              <ButtonText variant="destructive">Remove friend</ButtonText>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onPress={() => setModalVisible(false)}
            >
              <ButtonText variant="outline">Cancel</ButtonText>
            </Button>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
