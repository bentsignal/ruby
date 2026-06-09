import { Image, Text, View } from "react-native";
import { useMutation } from "convex/react";
import { Check } from "lucide-react-native";

import { api } from "@acme/convex/api";
import { Button, ButtonText } from "@acme/ui-mobile/button";

import { SafeAreaView } from "~/components/safe-area-view";
// import { SignOutButton } from "~/features/auth/components/sign-out-button";
import { useRedirectIfSignedIn } from "~/features/auth/hooks/use-redirect-if-signed-in";
import { useAuthStore } from "~/features/auth/store";
import { useColor } from "~/hooks/use-color";
import logo from "../../assets/rounded-icon.png";

export default function Waitlist() {
  const foreground = useColor("primary-foreground");
  const waitlistStatus = useAuthStore((s) => s.waitlistStatus);
  const joinWaitlist = useMutation(
    api.waitlist.mutations.join,
  ).withOptimisticUpdate((localStore) => {
    localStore.setQuery(api.waitlist.queries.getMyStatus, {}, "on-waitlist");
  });

  useRedirectIfSignedIn();

  return (
    <SafeAreaView className="bg-background relative flex-1" bottom>
      <View className="bg-muted/20 absolute inset-0" />
      <View className="h-full w-full flex-col items-center justify-center gap-6 px-6 py-10">
        <Image source={logo} className="size-20 rounded-[22px]" />
        <View className="max-w-[340px] gap-3">
          <Text className="text-foreground text-center text-3xl font-semibold">
            Coming soon...
          </Text>
          <Text className="text-muted-foreground text-center text-sm leading-6">
            Ruby is currently in development. Join the waitlist and we will let
            you in as soon as it's ready.
          </Text>
        </View>
        <Button
          size="lg"
          className="h-12 min-w-56 px-5"
          disabled={waitlistStatus === "on-waitlist"}
          onPress={() => void joinWaitlist({})}
        >
          {waitlistStatus === "on-waitlist" ? (
            <>
              <Check size={17} color={foreground} />
              <ButtonText>You're on the list</ButtonText>
            </>
          ) : (
            <ButtonText>Join the waitlist</ButtonText>
          )}
        </Button>
        {/* <SignOutButton /> */}
      </View>
    </SafeAreaView>
  );
}
