import { KeyboardAvoidingView } from "react-native";

import { cn } from "@acme/std/cn";

export function SearchContainer({
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
