import { createStore } from "rostra";

import { useColor } from "~/hooks/use-color";
import { useLocationSearch } from "./state";

function useInternalStore({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const search = useLocationSearch({ isOpen, onOpenChange });
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");

  return {
    foreground,
    isOpen,
    mutedForeground,
    ...search,
  };
}

export const {
  Store: LocationSearchSheetStore,
  useStore: useLocationSearchSheetStore,
} = createStore(useInternalStore);
