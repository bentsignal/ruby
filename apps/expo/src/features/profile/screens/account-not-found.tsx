import { Text, View } from "react-native";
import { SearchIcon } from "lucide-react-native";

import { Button, ButtonText } from "~/atoms/button";
import { useVar } from "~/hooks/use-color";

const AccountNotFound = () => {
  const primaryForeground = useVar("primary-foreground");
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-foreground text-center text-lg font-bold">
        Sorry about that.
      </Text>
      <Text className="text-muted-foreground text-center text-sm">
        We couldn't find the account you're looking for.
      </Text>
      <Button className="mt-2">
        <SearchIcon color={primaryForeground} size={16} />
        <ButtonText>Search for another account</ButtonText>
      </Button>
    </View>
  );
};

export { AccountNotFound };
