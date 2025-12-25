import { Pressable, Text } from "react-native";
import { LogOut } from "lucide-react-native";

import { useRequiredContext } from "@acme/context";

import { Button } from "~/atoms/button";
import {
  Context as AuthContext,
  useContext as useAuthContext,
} from "~/features/auth/atom/auth-context";
import { GoogleIcon } from "~/features/auth/icons";
import { useVar } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";

const GoogleSignInButton = () => {
  useRequiredContext(AuthContext);
  const signInWithGoogle = useAuthContext((c) => c.signInWithGoogle);
  const disabled = useAuthContext((c) => c.isLoading || c.imSignedIn);
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
  useRequiredContext(AuthContext);
  const signOut = useAuthContext((c) => c.signOut);
  const disabled = useAuthContext((c) => c.isLoading || !c.imSignedIn);
  const primaryForeground = useVar("secondary-foreground");
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
