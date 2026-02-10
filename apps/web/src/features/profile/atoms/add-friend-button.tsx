import { useMutation } from "convex/react";
import { UserRoundPlus } from "lucide-react";

import { api } from "@acme/convex/api";
import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";

import { cn } from "~/utils/style-utils";
import { useProfileStore } from "../store";

function AddFriendButton({ className }: { className?: string }) {
  const sendFriendRequest = useMutation(api.friends.sendRequest);
  const username = useProfileStore((s) => s.username);
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

export { AddFriendButton };
