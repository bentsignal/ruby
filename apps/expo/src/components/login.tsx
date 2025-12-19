import { Text, TouchableOpacity, View } from "react-native";

import { authClient } from "~/lib/auth-client";

const Login = () => {
  return (
    <View className="flex h-full w-full flex-col items-center justify-center gap-2 bg-blue-300">
      <TouchableOpacity
        onPress={() =>
          authClient.signIn.social({
            provider: "google",
          })
        }
        className="bg-primary rounded-md p-2"
      >
        <Text className="px-4 font-bold text-white">Login with Google</Text>
      </TouchableOpacity>
    </View>
  );
};

export { Login };
