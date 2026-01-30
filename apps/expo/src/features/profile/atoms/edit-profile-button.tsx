import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";

import { Button, ButtonText } from "~/atoms/button";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";

export function EditProfileButton({ className }: { className?: string }) {
  const router = useRouter();
  const primaryForeground = useColor("primary-foreground");
  return (
    <Button
      className={cn("rounded-full", className)}
      onPress={() => router.push("/edit-profile")}
    >
      <Pencil size={16} color={primaryForeground} />
      <ButtonText>Edit Profile</ButtonText>
    </Button>
  );
}
