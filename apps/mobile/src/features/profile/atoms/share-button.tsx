import { Share } from "react-native";
import { ShareIcon } from "lucide-react-native";

import { Button } from "~/atoms/button";
import { env } from "~/expo.env";
import { useColor } from "~/hooks/use-color";
import { useProfileStore } from "../store";

export function ShareButton() {
  const foreground = useColor("foreground");
  const username = useProfileStore((s) => s.username);
  const share = async () => {
    await Share.share({
      message: "Share your adventures on Ruby!",
      url: `${env("SITE_URL")}/${username}`,
    });
  };
  return (
    <Button onPress={share} variant="outline" size="icon">
      <ShareIcon size={16} color={foreground} />
    </Button>
  );
}
