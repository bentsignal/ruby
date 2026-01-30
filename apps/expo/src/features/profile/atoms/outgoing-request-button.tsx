import { Text, View } from "react-native";
import { useMutation } from "convex/react";
import { X } from "lucide-react-native";

import { api } from "@acme/convex/api";

import { Button } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";

export function OutgoingRequestButton({ className }: { className?: string }) {
  const cancelFriendRequest = useMutation(api.friends.cancelFriendRequest);
  const username = useProfileStore((s) => s.username);
  const foreground = useColor("foreground");
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Text className="text-muted-foreground">Friend request sent</Text>
      <View className="ml-auto flex-row gap-2">
        <Button
          variant="outline"
          size="icon"
          onPress={() => cancelFriendRequest({ username })}
        >
          <X size={16} color={foreground} />
        </Button>
      </View>
    </View>
  );
}
