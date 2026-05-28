import { Share } from "react-native";
import { ShareIcon } from "lucide-react-native";

import { Button } from "~/atoms/button";
import { useColor } from "~/hooks/use-color";
import { urls } from "~/utils/urls";
import { useProfileStore } from "../store";

export function ShareButton() {
  const foreground = useColor("foreground");
  const username = useProfileStore((s) => s.username);
  async function share() {
    await Share.share({
      message: "Share your adventures on Ruby!",
      url: `${urls.web}/${username}`,
    });
  }
  return (
    <Button onPress={share} variant="outline" size="icon">
      <ShareIcon size={16} color={foreground} />
    </Button>
  );
}
