import { Image, Text, View } from "react-native";

import { useRequiredContext } from "@acme/context";

import { cn } from "~/utils/style-utils";
import {
  Context as ProfileContext,
  useContext as useProfileContext,
} from "./profile-context";

const ProfileImage = ({
  className,
  variant = "post",
}: {
  className?: string;
  variant?: "post" | "profile";
}) => {
  useRequiredContext(ProfileContext);
  const image = useProfileContext((c) => c.image);
  if (!image) return <BlankProfileImage />;
  return (
    <Image
      source={{ uri: image }}
      className={cn(
        "rounded-full",
        variant === "profile" ? "size-16" : "size-10",
        className,
      )}
    />
  );
};

const BlankProfileImage = ({
  className,
  variant = "post",
}: {
  className?: string;
  variant?: "post" | "profile";
}) => {
  return (
    <View
      className={cn(
        "bg-muted rounded-full",
        variant === "profile" ? "size-16" : "size-10",
        className,
      )}
    />
  );
};

const ProfileInfo = () => {
  useRequiredContext(ProfileContext);
  const name = useProfileContext((c) => c.name);
  const username = useProfileContext((c) => c.username);
  return (
    <View className="">
      <Text className="text-foreground text-base font-bold">{name}</Text>
      <Text className="text-foreground text-xs">@{username}</Text>
    </View>
  );
};

export { ProfileImage, BlankProfileImage, ProfileInfo };
