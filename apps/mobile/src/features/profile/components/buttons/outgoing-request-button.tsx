import { Text, View } from "react-native";
import { X } from "lucide-react-native";

import { useCancelFriendRequest } from "@acme/features/friends";
import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-mobile/button";

import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";

export function OutgoingRequestButton({ className }: { className?: string }) {
  const username = useProfileStore((s) => s.username);
  const cancelFriendRequest = useCancelFriendRequest({ username });
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
