import { Image, Text, View } from "react-native";

import { useRequiredContext } from "@acme/context";

import {
  Context as ProfileContext,
  useContext as useProfileContext,
} from "./profile-context";

const ProfileImage = () => {
  useRequiredContext(ProfileContext);
  const image = useProfileContext((c) => c.image);
  if (!image) return <BlankProfileImage />;
  return <Image source={{ uri: image }} className="size-16 rounded-full" />;
};

const BlankProfileImage = () => {
  return <View className="bg-muted size-16 rounded-full" />;
};

const ProfileInfo = () => {
  useRequiredContext(ProfileContext);
  const name = useProfileContext((c) => c.name);
  return <Text className="text-foreground text-xl font-bold">{name}</Text>;
};

export { ProfileImage, BlankProfileImage, ProfileInfo };
