import type { PressableProps } from "react-native";
import { Pressable } from "react-native";
import { XIcon } from "lucide-react-native";

import { cn } from "@acme/std/cn";

import { useSearchStore } from "~/features/search/store";
import { useColor } from "~/hooks/use-color";

export function ClearButton({ className, ...props }: PressableProps) {
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  const hideButton = useSearchStore((s) => s.searchTerm.length === 0);
  const sidebarForeground = useColor("sidebar-foreground");
  if (hideButton) return null;
  return (
    <Pressable
      className={cn("py-2 pl-2", className)}
      onPress={() => setSearchTerm("")}
      {...props}
    >
      <XIcon size={16} color={sidebarForeground} />
    </Pressable>
  );
}
