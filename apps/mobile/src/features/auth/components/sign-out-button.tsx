import { LogOut } from "lucide-react-native";

import { Button } from "~/atoms/button";
import { useColor } from "~/hooks/use-color";
import { useAuthStore } from "../store";

export function SignOutButton({ className }: { className?: string }) {
  const signOut = useAuthStore((s) => s.signOut);
  const disabled = useAuthStore((s) => s.isLoading || !s.imSignedIn);
  const primaryForeground = useColor("primary-foreground");
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
}
