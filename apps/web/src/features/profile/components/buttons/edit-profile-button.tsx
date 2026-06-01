import { PencilIcon } from "lucide-react";

import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-web/button";

import { QuickLink } from "~/components/quick-link";

export function EditProfileButton({ className }: { className?: string }) {
  return (
    <Button className={cn("rounded-full", className)} asChild>
      <QuickLink to="/edit-profile">
        <PencilIcon className="size-4" />
        Edit Profile
      </QuickLink>
    </Button>
  );
}
