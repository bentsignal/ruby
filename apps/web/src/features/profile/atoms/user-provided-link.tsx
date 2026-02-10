import { Globe } from "lucide-react";

import { Button } from "@acme/ui/button";

import { cn } from "~/utils/style-utils";
import { useProfileStore } from "../store";
import { normalizeProfileLink } from "../utils";

function UserProvidedLink({ className }: { className?: string }) {
  const link = useProfileStore((s) => s.link);
  if (!link) return null;
  const { href, display } = normalizeProfileLink(link);
  return (
    <Button
      variant="link"
      className={cn("text-muted-foreground h-fit w-fit p-0!", className)}
      asChild
    >
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="User's website (external link that opens in new tab)"
      >
        <Globe className="size-4" />
        {display}
      </a>
    </Button>
  );
}

export { UserProvidedLink };
