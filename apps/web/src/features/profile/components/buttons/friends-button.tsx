import { ChevronDown, UserRound } from "lucide-react";

import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-web/button";
import * as Dropdown from "@acme/ui-web/dropdown-menu";

import { RemoveFriendButton } from "./remove-friend-button";

export function FriendsButton({ className }: { className?: string }) {
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
