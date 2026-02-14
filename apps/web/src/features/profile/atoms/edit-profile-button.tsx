import { Link } from "@tanstack/react-router";
import { PencilIcon } from "lucide-react";

import { Button } from "@acme/ui/button";

import { cn } from "~/utils/style-utils";

function EditProfileButton({ className }: { className?: string }) {
  return (
    <Button className={cn("rounded-full", className)} asChild>
      <Link to="/edit-profile">
        <PencilIcon className="size-4" />
        Edit Profile
      </Link>
    </Button>
  );
}

export { EditProfileButton };
