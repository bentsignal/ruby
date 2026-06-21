import { cn } from "@acme/std/cn";

export function PostSeparator({
  className,
}: {
  className?: string;
  leadingItem?: unknown;
}) {
  return (
    <div className={cn("mx-auto flex h-9 w-full items-center px-4", className)}>
      <div className="via-border/60 h-px w-full bg-gradient-to-r from-transparent from-5% via-50% to-transparent to-95%" />
    </div>
  );
}
