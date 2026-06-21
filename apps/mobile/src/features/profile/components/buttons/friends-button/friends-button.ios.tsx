import { View } from "react-native";
import {
  Host,
  Menu,
  RNHostView,
  Button as SwiftUIButton,
} from "@expo/ui/swift-ui";
import { UserRound } from "lucide-react-native";
import { withUniwind } from "uniwind";

import { cn } from "@acme/std/cn";
import { ButtonText, buttonVariants } from "@acme/ui-mobile/button";

import { useColor } from "~/hooks/use-color";
import { useFriendsButtonStore } from "./store";

const UniwindHost = withUniwind(Host);

export function FriendsButton({ className }: { className?: string }) {
  const removeFriend = useFriendsButtonStore((s) => s.removeFriend);
  const foreground = useColor("foreground");

  return (
    <UniwindHost className={cn("h-10 self-stretch", className)}>
      <Menu label={<FriendsButtonTrigger foreground={foreground} />}>
        <SwiftUIButton
          role="destructive"
          onPress={removeFriend}
          systemImage="person.badge.minus"
          label="Remove friend"
        />
        <SwiftUIButton systemImage="x.circle" role="default" label="Cancel" />
      </Menu>
    </UniwindHost>
  );
}

function FriendsButtonTrigger({ foreground }: { foreground: string }) {
  return (
    <RNHostView>
      <View
        pointerEvents="none"
        className={buttonVariants({ variant: "outline", className: "w-full" })}
      >
        <UserRound size={16} color={foreground} />
        <ButtonText variant="outline">Friends</ButtonText>
      </View>
    </RNHostView>
  );
}
