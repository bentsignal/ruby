import type { PFPVariant } from "../types";
import { cn } from "~/utils/style-utils";
import { getPFPClassName } from "../utils";

function BlankPFP({
  className,
  variant = "sm",
}: {
  className?: string;
  variant?: PFPVariant;
}) {
  return (
    <div
      className={cn(
        "bg-muted rounded-full",
        getPFPClassName(variant),
        className,
      )}
    />
  );
}

export { BlankPFP };
