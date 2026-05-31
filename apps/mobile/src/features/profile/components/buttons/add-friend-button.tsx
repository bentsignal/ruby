import { UserRoundPlus } from "lucide-react-native";

import { useSendFriendRequest } from "@acme/convex/react";

import { Button, ButtonText } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";

export function AddFriendButton({ className }: { className?: string }) {
  const username = useProfileStore((s) => s.username);
  const sendFriendRequest = useSendFriendRequest({ username });
  const primaryForeground = useColor("primary-foreground");
  return (
    <Button
      className={cn("", className)}
      onPress={() => sendFriendRequest({ username })}
    >
      <UserRoundPlus size={16} color={primaryForeground} />
      <ButtonText>Add friend</ButtonText>
    </Button>
  );
}
