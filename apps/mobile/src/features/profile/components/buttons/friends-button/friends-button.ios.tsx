import { ContextMenu, Host, Button as SwiftUIButton } from "@expo/ui/swift-ui";
import { UserRound } from "lucide-react-native";
import { withUniwind } from "uniwind";

import { Button, ButtonText } from "~/atoms/button";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";
import { SettingsButton } from "../settings-button";
import { useFriendsButtonStore } from "./store";

const UniwindHost = withUniwind(Host);

export function FriendsButton() {
  const removeFriend = useFriendsButtonStore((s) => s.removeFriend);
  const foreground = useColor("foreground");

  return (
    <UniwindHost matchContents className="mx-4">
      <ContextMenu>
        <ContextMenu.Items>
          <SwiftUIButton
            role="destructive"
            onPress={removeFriend}
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
