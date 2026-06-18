import { createStore } from "rostra";

import { useLocationSearchState } from "@acme/features/post-create/location-search-state";

import { useColor } from "~/hooks/use-color";
import { useCreateStore } from "../store";

function useInternalStore({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const foreground = useColor("foreground");
  const mutedForeground = useColor("muted-foreground");
  const setLocation = useCreateStore((store) => store.setLocation);
  const search = useLocationSearchState({ isOpen, onOpenChange, setLocation });

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
