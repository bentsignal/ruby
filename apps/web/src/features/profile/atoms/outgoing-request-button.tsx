import { X } from "lucide-react";

import { useCancelFriendRequest } from "@acme/convex/react";
import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";
import * as Tooltip from "@acme/ui/tooltip";

import { cn } from "~/utils/style-utils";
import { useProfileStore } from "../store";

function OutgoingRequestButton({ className }: { className?: string }) {
  const username = useProfileStore((s) => s.username);
  const cancelFriendRequest = useCancelFriendRequest({ username });
  return (
    <div className={cn("flex flex-row items-center gap-2", className)}>
      <span className="text-muted-foreground">Friend request sent</span>
      <div className="ml-auto flex flex-row gap-2 lg:ml-0">
        <Tooltip.Container>
          <Tooltip.Trigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={() =>
                cancelFriendRequest({ username }).catch((error) => {
                  toast.error("Failed to cancel friend request");
                  throw error;
                })
              }
            >
              <X className="size-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content>
            <span>Cancel friend request</span>
          </Tooltip.Content>
        </Tooltip.Container>
      </div>
    </div>
  );
}

export { OutgoingRequestButton };
