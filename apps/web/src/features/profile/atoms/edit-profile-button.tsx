import { PencilIcon } from "lucide-react";

import { Button } from "@acme/ui/button";

import { QuickLink } from "~/components/quick-link";
import { cn } from "~/utils/style-utils";

function EditProfileButton({ className }: { className?: string }) {
  return (
    <Button className={cn("rounded-full", className)} asChild>
      <QuickLink to="/edit-profile">
        <PencilIcon className="size-4" />
        Edit Profile
      </QuickLink>
    </Button>
  );
}

export { EditProfileButton };
