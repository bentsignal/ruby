import { Pressable, Text } from "react-native";
import { router } from "expo-router";

import { Button, ButtonText } from "~/atoms/button";
import { GoogleIcon } from "~/features/auth/icons";
import { authClient } from "~/lib/auth-client";
import { cn } from "~/utils/style-utils";

const TakeMeToLogin = () => {
  return (
    <Button onPress={() => router.push("/login")}>
      <ButtonText>Take Me To Login</ButtonText>
    </Button>
  );
};

const GoogleSignInButton = () => {
  return (
    <Pressable
      onPress={() =>
        authClient.signIn.social({ provider: "google", callbackURL: "/" })
      }
      style={{
        height: 44,
      }}
      className={cn(
        "flex-row items-center justify-center rounded-full border",
        "border-[#747775] bg-white",
        "dark:border-[#8E918F] dark:bg-[#131314]",
      )}
    >
      <GoogleIcon />
      <Text
        style={{ fontFamily: "Roboto_500Medium" }}
        className="text-[#1F1F1F] dark:text-[#E3E3E3]"
      >
        Sign in with Google
      </Text>
    </Pressable>
  );
};

const SignOutButton = () => {
  return (
    <Button onPress={() => authClient.signOut()}>
      <ButtonText>Sign Out</ButtonText>
    </Button>
  );
};

export { TakeMeToLogin, GoogleSignInButton, SignOutButton };
