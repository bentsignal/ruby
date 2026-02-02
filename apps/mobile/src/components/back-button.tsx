import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";

import { Button } from "~/atoms/button";
import { useColor } from "~/hooks/use-color";

export function BackButton() {
  const router = useRouter();
  const foreground = useColor("foreground");
  return (
    <Button onPress={() => router.back()} variant="outline" size="icon">
      <ArrowLeft size={16} color={foreground} />
    </Button>
  );
}
