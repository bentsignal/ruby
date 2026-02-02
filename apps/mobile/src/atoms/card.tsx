import { View } from "react-native";

import { cn } from "~/utils/style-utils";

const Card = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return (
    <View
      className={cn(
        "border-border bg-card rounded-xl border p-4 shadow",
        className,
      )}
    >
      {children}
    </View>
  );
};

export { Card };
