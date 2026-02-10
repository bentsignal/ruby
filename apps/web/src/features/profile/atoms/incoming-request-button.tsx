import { useMutation } from "convex/react";
import { Check, X } from "lucide-react";

import { api } from "@acme/convex/api";
import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";
import * as Tooltip from "@acme/ui/tooltip";

import { cn } from "~/utils/style-utils";
import { useProfileStore } from "../store";

function IncomingRequestButton({ className }: { className?: string }) {
  const acceptFriendRequest = useMutation(api.friends.acceptRequest);
  const ignoreFriendRequest = useMutation(api.friends.ignoreRequest);
  const username = useProfileStore((s) => s.username);
  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <span className="text-muted-foreground">Incoming friend request</span>
      <div className="ml-auto flex flex-row gap-2 lg:ml-0">
        <Tooltip.Container>
          <Tooltip.Trigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                ignoreFriendRequest({ username }).catch((error) => {
                  toast.error("Failed to ignore friend request");
                  throw error;
                })
              }
            >
              <X className="size-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <span>Ignore friend request</span>
          </Tooltip.Content>
        </Tooltip.Container>
        <Tooltip.Container>
          <Tooltip.Trigger asChild>
            <Button
              size="icon"
              className="bg-green-300 hover:bg-green-300/90 dark:bg-green-600 dark:hover:bg-green-600/90"
              onClick={() =>
                acceptFriendRequest({ username }).catch((error) => {
                  toast.error("Failed to accept friend request");
                  throw error;
                })
              }
            >
              <Check className="text-foreground size-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <span>Accept friend request</span>
          </Tooltip.Content>
        </Tooltip.Container>
      </div>
    </div>
  );
}

export { IncomingRequestButton };
