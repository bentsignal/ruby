import { Linking } from "react-native";
import { Globe } from "lucide-react-native";

import { Button, ButtonText } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";
import { normalizeProfileLink } from "../utils";

export function UserProvidedLink({ className }: { className?: string }) {
  const linkString = useProfileStore((s) => s.link);
  const mutedForeground = useColor("muted-foreground");
  if (!linkString) return null;
  const link = normalizeProfileLink(linkString);
  if (!link) return null;
  return (
    <Button
      variant="link"
      className={cn("h-auto w-fit justify-start p-0", className)}
      onPress={() => Linking.openURL(link.href)}
    >
      <Globe size={16} color={mutedForeground} />
      <ButtonText className="text-muted-foreground">{link.display}</ButtonText>
    </Button>
  );
}
