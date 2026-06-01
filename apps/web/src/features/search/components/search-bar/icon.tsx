import { Search } from "lucide-react";

import { cn } from "~/utils/style-utils";

export function Icon({ className }: { className?: string }) {
  return <Search className={cn("text-sidebar-foreground size-4", className)} />;
}
