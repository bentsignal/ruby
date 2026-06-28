import { ChevronLeft, ChevronRight, X } from "lucide-react";

import { cn } from "@acme/std/cn";
import { Button } from "@acme/ui-web/button";

export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      aria-label="Close media viewer"
      className="bg-black/45 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-white/15"
      onClick={onClick}
      size="icon"
      type="button"
      variant="ghost"
    >
      <X className="size-5" />
    </Button>
  );
}

export function NavButton({
  direction,
  disabled,
  onClick,
}: {
  direction: "previous" | "next";
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = direction === "previous" ? ChevronLeft : ChevronRight;

  return (
    <Button
      aria-label={direction === "previous" ? "Previous item" : "Next item"}
      className={cn(
        "absolute top-1/2 z-30 hidden size-12 -translate-y-1/2 rounded-full bg-black/40 text-white shadow-lg ring-1 ring-white/10 backdrop-blur-md hover:bg-white/15 disabled:opacity-20 sm:grid",
        direction === "previous" ? "left-4" : "right-4",
      )}
      disabled={disabled}
      onClick={onClick}
      size="icon"
      type="button"
      variant="ghost"
    >
      <Icon className="size-6" />
    </Button>
  );
}
