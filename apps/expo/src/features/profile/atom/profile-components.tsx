import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  Text,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { useMutation, useQuery } from "convex/react";
import {
  Check,
  Globe,
  Pencil,
  UserRound,
  UserRoundMinus,
  UserRoundPlus,
  X,
} from "lucide-react-native";

import { api } from "@acme/convex/api";

import type { PFPVariant } from "../types";
import { Button, ButtonText } from "~/atoms/button";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";
import {
  getPFPClassName,
  getPFPSizeNumber,
  normalizeProfileLink,
} from "../utils";
import { useStore as useProfileStore } from "./profile-store";

function PFP({
  className,
  variant = "sm",
}: {
  className?: string;
  variant?: PFPVariant;
}) {
  const image = useProfileStore((s) => s.image);
  const size = getPFPSizeNumber(variant);
  if (!image) return <BlankPFP className={className} variant={variant} />;
  return (
    <Image
      source={{ uri: image }}
      style={{ width: size, height: size }}
      className={cn("rounded-full", getPFPClassName(variant), className)}
    />
  );
}

function BlankPFP({
  className,
  variant = "sm",
}: {
  className?: string;
  variant?: PFPVariant;
}) {
  return (
    <View
      className={cn(
        "bg-muted rounded-full",
        getPFPClassName(variant),
        className,
      )}
    />
  );
}

function Name({ className }: { className?: string }) {
  const name = useProfileStore((s) => s.name);
  return (
    <Text className={cn("text-foreground text-lg font-bold", className)}>
      {name}
    </Text>
  );
}

function Username({ className }: { className?: string }) {
  const username = useProfileStore((s) => s.username);
  return (
    <Text className={cn("text-muted-foreground", className)}>@{username}</Text>
  );
}

function Bio({ className }: { className?: string }) {
  const bio = useProfileStore((s) => s.bio);
  if (!bio) return null;
  return <Text className={cn("text-foreground", className)}>{bio}</Text>;
}

function UserProvidedLink({ className }: { className?: string }) {
  const link = useProfileStore((s) => s.link);
  const mutedForeground = useColor("muted-foreground");
  if (!link) return null;
  const { href, display } = normalizeProfileLink(link);
  return (
    <Button
      variant="link"
      className={cn("h-auto w-fit justify-start p-0", className)}
      onPress={() => Linking.openURL(href)}
    >
      <Globe size={16} color={mutedForeground} />
      <ButtonText className="text-muted-foreground">{display}</ButtonText>
    </Button>
  );
}

function PrimaryButton({ className }: { className?: string }) {
  const initialStatus = useProfileStore((s) => s.relationship);
  const username = useProfileStore((s) => s.username);
  const reactiveStatus = useQuery(api.friends.getRelationship, { username });
  const relationship =
    reactiveStatus?.relationship === undefined
      ? initialStatus
      : reactiveStatus.relationship;
  if (relationship === undefined) return null;
  if (relationship === "my-profile") {
    return <EditProfileButton className={className} />;
  }
  if (relationship === "pending-incoming") {
    return <IncomingRequestButton className={className} />;
  }
  if (relationship === "pending-outgoing") {
    return <OutgoingRequestButton className={className} />;
  }
  if (relationship === "friends") {
    return <FriendsButton className={className} />;
  }
  return <AddFriendButton className={className} />;
}

function EditProfileButton({ className }: { className?: string }) {
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

function IncomingRequestButton({ className }: { className?: string }) {
  const acceptFriendRequest = useMutation(api.friends.acceptFriendRequest);
  const ignoreFriendRequest = useMutation(api.friends.ignoreFriendRequest);
  const username = useProfileStore((s) => s.username);
  const foreground = useColor("foreground");
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Text className="text-muted-foreground">Incoming friend request</Text>
      <View className="ml-auto flex-row gap-2">
        <Button
          variant="outline"
          size="icon"
          onPress={() => ignoreFriendRequest({ username })}
        >
          <X size={16} color={foreground} />
        </Button>
        <Button
          size="icon"
          className="bg-green-300 active:bg-green-300/90 dark:bg-green-600 dark:active:bg-green-600/90"
          onPress={() => acceptFriendRequest({ username })}
        >
          <Check size={16} color={foreground} />
        </Button>
      </View>
    </View>
  );
}

function OutgoingRequestButton({ className }: { className?: string }) {
  const cancelFriendRequest = useMutation(api.friends.cancelFriendRequest);
  const username = useProfileStore((s) => s.username);
  const foreground = useColor("foreground");
  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <Text className="text-muted-foreground">Friend request sent</Text>
      <View className="ml-auto flex-row gap-2">
        <Button
          variant="outline"
          size="icon"
          onPress={() => cancelFriendRequest({ username })}
        >
          <X size={16} color={foreground} />
        </Button>
      </View>
    </View>
  );
}

function FriendsButton({ className }: { className?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const removeFriend = useMutation(api.friends.removeFriend);
  const username = useProfileStore((s) => s.username);
  const foreground = useColor("foreground");
  const destructiveForeground = useColor("destructive-foreground");
  return (
    <>
      <Button
        variant="outline"
        className={cn("gap-2 rounded-full", className)}
        onPress={() => setIsOpen(true)}
      >
        <UserRound size={16} color={foreground} />
        <ButtonText>Friends</ButtonText>
      </Button>
      <Modal
        transparent
        animationType="fade"
        visible={isOpen}
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/60 px-6"
          onPress={() => setIsOpen(false)}
        >
          <View className="bg-card w-full max-w-sm rounded-2xl p-4">
            <Text className="text-foreground text-base font-bold">Friends</Text>
            <Text className="text-muted-foreground text-sm">
              Actions for this user
            </Text>
            <View className="mt-4 gap-2">
              <Button
                variant="destructive"
                onPress={() => {
                  setIsOpen(false);
                  Alert.alert(
                    "Remove friend?",
                    "This will remove this user from your friends.",
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Remove",
                        style: "destructive",
                        onPress: () => {
                          void removeFriend({ username });
                        },
                      },
                    ],
                  );
                }}
              >
                <UserRoundMinus size={16} color={destructiveForeground} />
                <ButtonText variant="destructive">Remove friend</ButtonText>
              </Button>
              <Button variant="outline" onPress={() => setIsOpen(false)}>
                <ButtonText>Cancel</ButtonText>
              </Button>
            </View>
          </View>
        </Pressable>
      </Modal>
    </>
  );
}

function AddFriendButton({ className }: { className?: string }) {
  const sendFriendRequest = useMutation(api.friends.sendFriendRequest);
  const username = useProfileStore((s) => s.username);
  const primaryForeground = useColor("primary-foreground");
  return (
    <Button
      className={cn("rounded-full", className)}
      onPress={() => sendFriendRequest({ username })}
    >
      <UserRoundPlus size={16} color={primaryForeground} />
      <ButtonText>Add friend</ButtonText>
    </Button>
  );
}

export { PFP, BlankPFP, Name, Username, Bio, UserProvidedLink, PrimaryButton };
