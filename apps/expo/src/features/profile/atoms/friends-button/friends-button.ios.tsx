import { Alert } from "react-native";
import { ContextMenu, Host, Button as SwiftUIButton } from "@expo/ui/swift-ui";
import { useMutation } from "convex/react";
import { UserRound } from "lucide-react-native";
import { withUniwind } from "uniwind";

import { api } from "@acme/convex/api";

import { Button, ButtonText } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";
import { SettingsButton } from "../settings-button";

const UniwindHost = withUniwind(Host);

export function FriendsButton() {
  const removeFriend = useMutation(api.friends.removeFriend);
  const name = useProfileStore((s) => s.name);
  const username = useProfileStore((s) => s.username);
  const foreground = useColor("foreground");

  const handleRemoveFriend = () => {
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
    <UniwindHost matchContents className="mx-4">
      <ContextMenu>
        <ContextMenu.Items>
          <SwiftUIButton
            role="destructive"
            onPress={handleRemoveFriend}
            systemImage="person.badge.minus"
          >
            Remove friend
          </SwiftUIButton>
          <SwiftUIButton systemImage="x.circle" role="default">
            Cancel
          </SwiftUIButton>
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Button variant="outline" className={cn("w-full")}>
            <UserRound size={16} color={foreground} />
            <ButtonText variant="outline">Friends</ButtonText>
          </Button>
        </ContextMenu.Trigger>
        <SettingsButton />
      </ContextMenu>
    </UniwindHost>
  );
}
