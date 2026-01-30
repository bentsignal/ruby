import type { PressableProps, TextInputProps } from "react-native";
import { KeyboardAvoidingView, Pressable, TextInput } from "react-native";
import { SearchIcon, XIcon } from "lucide-react-native";

import { useColor } from "~/hooks/use-color";
import { cn } from "~/utils/style-utils";
import { useStore as useSearchStore } from "./search-store";

function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <KeyboardAvoidingView
      className={cn(
        "bg-sidebar border-sidebar-border flex-row items-center rounded-full border px-4",
        className,
      )}
    >
      {children}
    </KeyboardAvoidingView>
  );
}

function Icon({ className }: { className?: string }) {
  const sidebarForeground = useColor("sidebar-foreground");
  return (
    <SearchIcon size={16} color={sidebarForeground} className={className} />
  );
}

function Input({ className, ...props }: TextInputProps) {
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

function ClearButton({ className, ...props }: PressableProps) {
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

export { Container, Icon, Input, ClearButton };
