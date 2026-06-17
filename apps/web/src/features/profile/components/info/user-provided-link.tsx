import { Globe } from "lucide-react";

import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-web/button";

import { useProfileStore } from "../../store";
import { normalizeProfileLink } from "../../utils";

export function UserProvidedLink({ className }: { className?: string }) {
  const link = useProfileStore((s) => s.link);
  if (!link) return null;
  const normalizedLink = normalizeProfileLink(link);
  if (!normalizedLink) return null;
  const { href, display } = normalizedLink;
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
