import type { InputHTMLAttributes } from "react";
import { useEffect } from "react";

import { cn } from "@acme/std/cn";

import { useSearchStore } from "~/features/search/store";

export function Input({
  className,
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange">) {
  const focusInput = useSearchStore((s) => s.focusInput);
  const searchTerm = useSearchStore((s) => s.searchTerm);
  const setSearchTerm = useSearchStore((s) => s.setSearchTerm);
  const inputRef = useSearchStore((s) => s.inputRef);

  // eslint-disable-next-line no-restricted-syntax -- Focus syncs the search input with the mounted DOM node.
  useEffect(() => {
    focusInput();
  }, [focusInput]);

  return (
    <input
      ref={inputRef}
      className={cn(
        "text-sidebar-foreground placeholder:text-muted-foreground h-10 flex-1 bg-transparent px-4 outline-none",
        className,
      )}
      value={searchTerm}
      autoCorrect="off"
      autoCapitalize="off"
      autoComplete="off"
      placeholder="Search"
      onChange={(e) => setSearchTerm(e.target.value)}
      {...props}
    />
  );
}
