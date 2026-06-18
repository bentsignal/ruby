import type { TextInputProps } from "react-native";
import { TextInput } from "react-native";

import { cn } from "@acme/std/cn";

import { useSearchStore } from "~/features/search/store";

type InputProps = Omit<TextInputProps, "value">;

export function Input({ className, ...props }: InputProps) {
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  return (
    <TextInput
      className={cn("text-sidebar-foreground h-10 flex-1 px-4", className)}
      defaultValue={searchTerm}
      autoCorrect={false}
      autoCapitalize="none"
      autoComplete="off"
      placeholder="Search"
      onChangeText={setSearchTerm}
      {...props}
    />
  );
}
