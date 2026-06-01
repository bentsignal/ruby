import { LogIn } from "lucide-react";

import { Button } from "@acme/ui/button";

import { QuickLink } from "~/components/quick-link";

export function TakeMeToLoginLink() {
  return (
    <Button variant="link" className="px-0!" asChild>
      <QuickLink to="/login" search={(prev) => ({ ...prev })}>
        <LogIn size={16} />
        <span>Take me to login</span>
      </QuickLink>
    </Button>
  );
}
