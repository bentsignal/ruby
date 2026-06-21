import { useState } from "react";
import { Image, View } from "react-native";
import { UserRound } from "lucide-react-native";

import { cn } from "@acme/std/cn";

import type { PFPVariant } from "../../types";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { getPFPClassName, getPFPSizeNumber } from "../../utils";

interface PFPProps {
  className?: string;
  variant?: PFPVariant;
}

export function BlankPFP({ className, variant = "sm" }: PFPProps) {
  const color = useColor("muted-foreground");
  const size = getPFPSizeNumber(variant);

  return (
    <View
      className={cn(
        "border-border bg-muted items-center justify-center rounded-full border",
        getPFPClassName(variant),
        className,
      )}
    >
      <UserRound color={color} size={Math.max(16, size * 0.45)} />
    </View>
  );
}

export function PFP({ className, variant = "sm" }: PFPProps) {
  const image = useProfileStore((s) => s.image);
  if (!image) return <BlankPFP className={className} variant={variant} />;
  return (
    <RemotePFP
      className={className}
      image={image}
      key={image}
      variant={variant}
    />
  );
}

function RemotePFP({
  className,
  image,
  variant = "sm",
}: PFPProps & { image: string }) {
  const [failed, setFailed] = useState(false);
  const size = getPFPSizeNumber(variant);

  if (failed) return <BlankPFP className={className} variant={variant} />;

  return (
    <Image
      source={{ uri: image }}
      onError={() => setFailed(true)}
      resizeMode="cover"
      style={{ width: size, height: size }}
      className={cn("rounded-full", getPFPClassName(variant), className)}
    />
  );
}
