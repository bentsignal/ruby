import { Text, View } from "react-native";

import * as Auth from "~/features/auth/atom";
import { useAuthDrawerSize } from "~/features/auth/hooks/use-auth-drawer-size";
import { useRedirectIfSignedIn } from "~/features/auth/hooks/use-redirect-if-signed-in";

function Login() {
  useRedirectIfSignedIn();
  const { height: drawerHeight } = useAuthDrawerSize();

  return (
    <View
      style={{ height: drawerHeight }}
      className="w-full flex-col justify-center gap-4 px-6 py-8"
    >
      <Text className="text-foreground text-2xl font-bold">Welcome back!</Text>
      <Text className="text-muted-foreground">
        Please choose your preferred sign in method
      </Text>
      <Auth.GoogleSignInButton />
      <Text className="text-muted-foreground text-center text-xs">
        By continuing, you agree to our Terms of Service, and acknowledge that
        you have read our Privacy Policy.
      </Text>
    </View>
  );
}

export default Login;
