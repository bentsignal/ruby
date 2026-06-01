import { UserRoundPlus } from "lucide-react";

import { useSendFriendRequest } from "@acme/convex/react";
import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-web/button";
import { toast } from "@acme/ui-web/toast";

import { useProfileStore } from "~/features/profile/store";

export function AddFriendButton({ className }: { className?: string }) {
  const username = useProfileStore((s) => s.username);
  const sendFriendRequest = useSendFriendRequest({ username });
  return (
    <Button
      className={cn("rounded-full", className)}
      onClick={() =>
        sendFriendRequest({ username }).catch((error) => {
          toast.error("Failed to send friend request");
          throw error;
        })
      }
    >
      <UserRoundPlus className="size-4" />
      Add friend
    </Button>
  );
}
