import { useRouter } from "expo-router";
import { SettingsIcon } from "lucide-react-native";

import { Button } from "~/atoms/button";
import { useColor } from "~/hooks/use-color";
import { useProfileStore } from "../store";

export function SettingsButton() {
  const router = useRouter();
  const foreground = useColor("foreground");
  const relationship = useProfileStore((s) => s.relationship);
  if (relationship !== "my-profile") return null;
  return (
    <Button
      onPress={() => router.push("/settings")}
      variant="outline"
      size="icon"
    >
      <SettingsIcon size={16} color={foreground} />
    </Button>
  );
}
