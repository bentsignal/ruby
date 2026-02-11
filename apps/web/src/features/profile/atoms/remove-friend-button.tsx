import { useState } from "react";
import { UserRoundMinus, X } from "lucide-react";

import { useRemoveFriend } from "@acme/convex/react";
import { Button } from "@acme/ui/button";
import { toast } from "@acme/ui/toast";
import * as Tooltip from "@acme/ui/tooltip";

import { useProfileStore } from "../store";

function RemoveFriendButton() {
  const username = useProfileStore((s) => s.username);
  const removeFriend = useRemoveFriend({ username });
  const [showConfirmation, setShowConfirmation] = useState(false);
  if (showConfirmation) {
    return (
      <div className="flex w-full flex-row items-center justify-between gap-2 px-2">
        <span className="text-muted-foreground text-sm">Are you sure?</span>
        <div className="ml-auto flex flex-row gap-2 lg:ml-0">
          <Tooltip.Container>
            <Tooltip.Trigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowConfirmation(false)}
              >
                <X className="size-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>Cancel</span>
            </Tooltip.Content>
          </Tooltip.Container>
          <Tooltip.Container>
            <Tooltip.Trigger asChild>
              <Button
                size="icon"
                className="bg-red-300 hover:bg-red-300/90 dark:bg-red-600 dark:hover:bg-red-600/90"
                onClick={() =>
                  removeFriend({ username }).catch((error) => {
                    toast.error("Failed to remove friend");
                    throw error;
                  })
                }
              >
                <UserRoundMinus className="text-foreground size-4" />
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content>
              <span>Remove friend</span>
            </Tooltip.Content>
          </Tooltip.Container>
        </div>
      </div>
    );
  }
  return (
    <Button variant="link" onClick={() => setShowConfirmation(true)}>
      <UserRoundMinus className="size-4 text-red-500" />
      Remove friend
    </Button>
  );
}

export { RemoveFriendButton };
