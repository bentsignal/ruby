import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

import { authClient } from "~/lib/auth-client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (type === "login") {
      setLoading(true);
      await authClient.signIn.email({ email, password });
      setLoading(false);
    } else {
      setLoading(true);
      await authClient.signUp.email({ email, password, name: email });
      setLoading(false);
    }
  };

  const disabled = loading || !email || !password;

  return (
    <View className="flex h-full w-full flex-col items-center justify-center gap-2 bg-blue-300">
      <TextInput
        className="bg-input w-full rounded-md border border-gray-300 p-2"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="bg-input w-full rounded-md border border-gray-300 p-2"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="bg-primary rounded-md p-2"
        onPress={handleSubmit}
        disabled={disabled}
      >
        <Text className="text-primary-foreground p-2 font-bold">
          {type === "login" ? "Login" : "Register"}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          setType((current) => (current === "login" ? "register" : "login"))
        }
      >
        <Text className="text-primary p-2">
          {type === "login"
            ? "Don't have an account? Register"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export { Login };
