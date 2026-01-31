import { View } from "react-native";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";

import { Button, ButtonText } from "~/atoms/button";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";
import { SettingsButton } from "./settings-button";

export function EditProfileButton({ className }: { className?: string }) {
  const router = useRouter();
  const primaryForeground = useColor("primary-foreground");
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Button
        className={cn("flex-1 rounded-full")}
        onPress={() => router.push("/edit-profile")}
      >
        <Pencil size={16} color={primaryForeground} />
        <ButtonText>Edit Profile</ButtonText>
      </Button>
      <SettingsButton />
    </View>
  );
}
