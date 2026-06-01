import { View } from "react-native";
import { useRouter } from "expo-router";
import { Pencil } from "lucide-react-native";

import { cn } from "@acme/std/cn";
import { Button, ButtonText } from "@acme/ui-mobile/button";

import { useColor } from "~/hooks/use-color";
import { SettingsButton } from "./settings-button";

export function MyProfileButtons({ className }: { className?: string }) {
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
