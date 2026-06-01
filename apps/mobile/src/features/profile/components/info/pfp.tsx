import { Image, View } from "react-native";

import { cn } from "@acme/std/cn";

import type { PFPVariant } from "../../types";
import { useProfileStore } from "~/features/profile/store";
import { getPFPClassName, getPFPSizeNumber } from "../../utils";

interface PFPProps {
  className?: string;
  variant?: PFPVariant;
}

export function BlankPFP({ className, variant = "sm" }: PFPProps) {
  return (
    <View
      className={cn(
        "bg-muted rounded-full",
        getPFPClassName(variant),
        className,
      )}
    />
  );
}

export function PFP({ className, variant = "sm" }: PFPProps) {
  const image = useProfileStore((s) => s.image);
  const size = getPFPSizeNumber(variant);
  if (!image) return <BlankPFP className={className} variant={variant} />;
  return (
    <Image
      source={{ uri: image }}
      style={{ width: size, height: size }}
      className={cn("rounded-full", getPFPClassName(variant), className)}
    />
  );
}
