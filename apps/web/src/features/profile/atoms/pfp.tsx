import { Image } from "@unpic/react";

import type { PFPVariant } from "../types";
import { cn } from "~/utils/style-utils";
import { useProfileStore } from "../store";
import { getPFPClassName, getPFPSizeNumber } from "../utils";
import { BlankPFP } from "./blank-pfp";

function PFP({
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

export { PFP };
