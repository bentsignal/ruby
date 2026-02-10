import { ChevronDown, UserRound } from "lucide-react";

import { Button } from "@acme/ui/button";
import * as Dropdown from "@acme/ui/dropdown-menu";

import { cn } from "~/utils/style-utils";
import { RemoveFriendButton } from "./remove-friend-button";

function FriendsButton({ className }: { className?: string }) {
  return (
    <Dropdown.Container>
      <Dropdown.Trigger asChild>
        <Button
          variant="outline"
          className={cn("gap-2 rounded-full", className)}
        >
          <UserRound className="size-4" />
          <span>Friends</span>
          <ChevronDown className="size-4" />
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Content className="w-56 pb-2">
        <Dropdown.Group>
          <Dropdown.Label className="text-muted-foreground text-xs">
            Actions
          </Dropdown.Label>
          <Dropdown.Item asChild>
            <RemoveFriendButton />
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Content>
    </Dropdown.Container>
  );
}

export { FriendsButton };
