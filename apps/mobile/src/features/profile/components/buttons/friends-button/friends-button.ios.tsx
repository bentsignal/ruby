import { ContextMenu, Host, Button as SwiftUIButton } from "@expo/ui/swift-ui";
import { UserRound } from "lucide-react-native";
import { withUniwind } from "uniwind";

import { cn } from "@acme/std/cn";
import { Button, ButtonText } from "@acme/ui-mobile/button";

import { useColor } from "~/hooks/use-color";
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
            label="Remove friend"
          />
          <SwiftUIButton systemImage="x.circle" role="default" label="Cancel" />
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
