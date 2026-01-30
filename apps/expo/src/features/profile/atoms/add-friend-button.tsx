import { useMutation } from "convex/react";
import { UserRoundPlus } from "lucide-react-native";

import { api } from "@acme/convex/api";

import { Button, ButtonText } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";

export function AddFriendButton({ className }: { className?: string }) {
  const sendFriendRequest = useMutation(api.friends.sendFriendRequest);
  const username = useProfileStore((s) => s.username);
  const primaryForeground = useColor("primary-foreground");
  return (
    <Button
      className={cn("rounded-full", className)}
      onPress={() => sendFriendRequest({ username })}
    >
      <UserRoundPlus size={16} color={primaryForeground} />
      <ButtonText>Add friend</ButtonText>
    </Button>
  );
}
