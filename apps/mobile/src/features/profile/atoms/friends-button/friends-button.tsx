import { Modal, Pressable, View } from "react-native";
import { UserRound } from "lucide-react-native";

import { Button, ButtonText } from "~/atoms/button";
import { useColor } from "~/hooks/use-color";
import { useFriendsButtonStore } from "./friends-button-store";

export function FriendsButton() {
  const removeFriend = useFriendsButtonStore((s) => s.removeFriend);
  const isModalVisible = useFriendsButtonStore((s) => s.isModalVisible);
  const setModalVisibility = useFriendsButtonStore((s) => s.setModalVisibility);
  const foreground = useColor("foreground");

  return (
    <View className="mx-4">
      <Button
        variant="outline"
        className="w-full"
        onPress={() => setModalVisibility(true)}
      >
        <UserRound size={16} color={foreground} />
        <ButtonText variant="outline">Friends</ButtonText>
      </Button>

      <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisibility(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/50"
          onPress={() => setModalVisibility(false)}
        >
          <View className="bg-background mx-8 w-full max-w-sm rounded-2xl p-4">
            <Button
              variant="destructive"
              className="mb-2 w-full"
              onPress={removeFriend}
            >
              <ButtonText variant="destructive">Remove friend</ButtonText>
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onPress={() => setModalVisibility(false)}
            >
              <ButtonText variant="outline">Cancel</ButtonText>
            </Button>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
