import { Text } from "react-native";
import { useRouter } from "expo-router";
import { SearchIcon } from "lucide-react-native";

import { Button, ButtonText } from "~/atoms/button";
import { SafeAreaView } from "~/components/safe-area-view";
import { useColor } from "~/hooks/use-color";

function AccountNotFound() {
  const primaryForeground = useColor("primary-foreground");
  const router = useRouter();
  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <Text className="text-foreground mb-1 text-center text-lg font-bold">
        Sorry about that
      </Text>
      <Text className="text-muted-foreground text-center text-sm">
        We couldn't find the account you're looking for
      </Text>
      <Button className="mt-2" onPress={() => router.push("/search")}>
        <SearchIcon color={primaryForeground} size={16} />
        <ButtonText>Search for another account</ButtonText>
      </Button>
    </SafeAreaView>
  );
}

export { AccountNotFound };
