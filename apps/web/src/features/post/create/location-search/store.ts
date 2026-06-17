import { createStore } from "rostra";

import { useLocationSearch } from "./state";

function useInternalStore({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  return useLocationSearch({ isOpen, onOpenChange });
}

export const {
  Store: LocationSearchDialogStore,
  useStore: useLocationSearchDialogStore,
} = createStore(useInternalStore);
