import { Text } from "react-native";

import { useCreateStore } from "../store";

export function ComposerError() {
  const error = useCreateStore((store) => store.error);

  if (!error) return null;

  return <Text className="text-destructive text-sm">{error}</Text>;
}
