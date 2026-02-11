import { cn } from "~/utils/style-utils";

export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "bg-sidebar border-sidebar-border flex flex-row items-center rounded-full border px-4",
        className,
      )}
    >
      {children}
    </div>
  );
}
