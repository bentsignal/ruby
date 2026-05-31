import { Share } from "react-native";
import { Ellipsis } from "lucide-react-native";

import { Button } from "~/atoms/button";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { urls } from "~/utils/urls";

export function MoreButton() {
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
      <Ellipsis size={16} color={foreground} />
    </Button>
  );
}
