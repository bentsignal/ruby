import { Text, View } from "react-native";
import { useMutation } from "convex/react";
import { Check, X } from "lucide-react-native";

import { api } from "@acme/convex/api";

import { Button } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";

export function IncomingRequestButton({ className }: { className?: string }) {
  const acceptFriendRequest = useMutation(api.friends.acceptRequest);
  const ignoreFriendRequest = useMutation(api.friends.ignoreRequest);
  const username = useProfileStore((s) => s.username);
  const foreground = useColor("foreground");
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Text className="text-muted-foreground">Incoming friend request</Text>
      <View className="ml-auto flex-row gap-2">
        <Button
          variant="outline"
          size="icon"
          onPress={() => ignoreFriendRequest({ username })}
        >
          <X size={16} color={foreground} />
        </Button>
        <Button
          size="icon"
          className="bg-green-300 active:bg-green-300/90 dark:bg-green-600 dark:active:bg-green-600/90"
          onPress={() => acceptFriendRequest({ username })}
        >
          <Check size={16} color={foreground} />
        </Button>
      </View>
    </View>
  );
}
