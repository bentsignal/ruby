import { Alert } from "react-native";
import { Button as ComposeButton, ContextMenu } from "@expo/ui/jetpack-compose";
import { useMutation } from "convex/react";
import { UserRound } from "lucide-react-native";

import { api } from "@acme/convex/api";

import { Button, ButtonText } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";

export function FriendsButton({ className }: { className?: string }) {
  const removeFriend = useMutation(api.friends.removeFriend);
  const username = useProfileStore((s) => s.username);
  const foreground = useColor("foreground");
  const destructiveForeground = useColor("destructive-foreground");

  const handleRemoveFriend = () => {
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
  };

  return (
    <ContextMenu>
      <ContextMenu.Trigger>
        <Button
          variant="outline"
          className={cn("gap-2 rounded-full", className)}
        >
          <UserRound size={16} color={foreground} />
          <ButtonText variant="outline">Friends</ButtonText>
        </Button>
      </ContextMenu.Trigger>
      <ContextMenu.Items>
        <ComposeButton
          variant="outlined"
          color={destructiveForeground}
          onPress={handleRemoveFriend}
        >
          Remove friend
        </ComposeButton>
        <ComposeButton variant="outlined" color={foreground}>
          Cancel
        </ComposeButton>
      </ContextMenu.Items>
    </ContextMenu>
  );
}
