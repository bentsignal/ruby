import { Pressable, Text } from "react-native";
import { LogOut } from "lucide-react-native";

import { Button } from "~/atoms/button";
import { GoogleIcon } from "~/features/auth/icons";
import { useProfileStore } from "~/features/profile/store";
import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";
import { useStore as useAuthStore } from "./auth-store";

const GoogleSignInButton = () => {
  const signInWithGoogle = useAuthStore((s) => s.signInWithGoogle);
  const disabled = useAuthStore((s) => s.isLoading || s.imSignedIn);
  return (
    <Pressable
      onPress={signInWithGoogle}
      style={{
        height: 44,
      }}
      disabled={disabled}
      className={cn(
        "flex-row items-center justify-center rounded-full border disabled:opacity-50",
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

const SignOutButton = ({ className }: { className?: string }) => {
  const signOut = useAuthStore((s) => s.signOut);
  const disabled = useAuthStore((s) => s.isLoading || !s.imSignedIn);
  const primaryForeground = useColor("primary-foreground");
  const relationship = useProfileStore((s) => s.relationship, {
    optional: true,
  });
  if (relationship !== undefined && relationship !== "my-profile") {
    return null;
  }
  return (
    <Button
      variant="secondary"
      size="icon"
      onPress={signOut}
      disabled={disabled}
      className={className}
    >
      <LogOut color={primaryForeground} size={16} />
    </Button>
  );
};

export { GoogleSignInButton, SignOutButton };
