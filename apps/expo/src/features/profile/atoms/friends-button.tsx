import { useState } from "react";
import { Alert, Modal, Pressable, Text, View } from "react-native";
import { useMutation } from "convex/react";
import { UserRound, UserRoundMinus } from "lucide-react-native";

import { api } from "@acme/convex/api";

import { Button, ButtonText } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";

export function FriendsButton({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const removeFriend = useMutation(api.friends.removeFriend);
  const username = useProfileStore((s) => s.username);
  const foreground = useColor("foreground");
  const destructiveForeground = useColor("destructive-foreground");
  return (
    <>
      <Button
        variant="outline"
        className={cn("gap-2 rounded-full", className)}
        onPress={() => setIsOpen(true)}
      >
        <UserRound size={16} color={foreground} />
        <ButtonText variant="outline">Friends</ButtonText>
      </Button>
      <Modal
        transparent
        animationType="fade"
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/60 px-6"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-card w-full max-w-sm rounded-2xl p-4">
            <Text className="text-foreground text-base font-bold">Friends</Text>
            <Text className="text-muted-foreground text-sm">
              Actions for this user
            </Text>
            <View className="mt-4 gap-2">
              <Button
                variant="destructive"
                onPress={() => {
                  setIsOpen(false);
                  Alert.alert(
                    "Remove friend?",
                    "This will remove this user from your friends.",
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
                }}
              >
                <UserRoundMinus size={16} color={destructiveForeground} />
                <ButtonText variant="destructive">Remove friend</ButtonText>
              </Button>
              <Button variant="outline" onPress={() => setIsOpen(false)}>
                <ButtonText>Cancel</ButtonText>
              </Button>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}
