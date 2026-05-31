import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { useSearchStore } from "~/features/search/store";
import { cn } from "~/utils/style-utils";

export function SearchInput({ className, ...props }: TextInputProps) {
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  return (
    <TextInput
      className={cn("text-sidebar-foreground h-10 flex-1 px-4", className)}
      value={searchTerm}
      autoCorrect={false}
      autoCapitalize="none"
      autoComplete="off"
      placeholder="Search"
      onChangeText={setSearchTerm}
      {...props}
    />
  );
}
