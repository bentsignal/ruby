import { Text, View } from "react-native";

import { useRequiredContext } from "@acme/context";

import { LoadingSpinner } from "~/components/loading-spinner";
import * as Auth from "~/features/auth/atom";
import { useAuthDrawerSize } from "~/features/auth/hooks/use-auth-drawer-size";
import { useRedirectIfSignedIn } from "~/features/auth/hooks/use-redirect-if-signed-in";
import { useVar } from "~/hooks/use-color";

function Login() {
  useRedirectIfSignedIn();
  const { height: drawerHeight } = useAuthDrawerSize();

  return (
    <View style={{ height: drawerHeight }} className="relative">
      <LoadingOverlay />
      <View className="h-full w-full flex-col justify-center gap-4 px-6 py-8">
        <Text className="text-foreground text-2xl font-bold">
          Welcome back!
        </Text>
        <Text className="text-muted-foreground">
          Please choose your preferred sign in method
        </Text>
        <Auth.GoogleSignInButton />
        <Text className="text-muted-foreground text-center text-xs">
          By continuing, you agree to our Terms of Service, and acknowledge that
          you have read our Privacy Policy.
        </Text>
      </View>
    </View>
  );
}

const LoadingOverlay = () => {
  useRequiredContext(Auth.Context);
  const isLoading = Auth.useContext((c) => c.isLoading);
  const foreground = useVar("foreground");

  if (!isLoading) return null;

  return (
    <View className="bg-background/60 absolute top-0 right-0 z-1 h-full w-full items-center justify-center">
      <LoadingSpinner color={foreground} className="h-10 w-10 shadow-xl" />
    </View>
  );
};

export default Login;
