import { Image } from "@unpic/react";

import { cn } from "@acme/std/cn";

import type { PFPVariant } from "~/features/profile/types";
import { useProfileStore } from "~/features/profile/store";
import { getPFPClassName, getPFPSizeNumber } from "../../utils";

export function PFP({
  className,
  variant = "sm",
}: {
  className?: string;
  variant?: PFPVariant;
}) {
  const image = useProfileStore((s) => s.image);
  if (!image) return <BlankPFP className={className} variant={variant} />;
  const size = getPFPSizeNumber(variant);
  return (
    <Image
      src={image}
      alt="Profile"
      width={size}
      height={size}
      layout="fixed"
      className={cn("rounded-full", getPFPClassName(variant), className)}
    />
  );
}

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
