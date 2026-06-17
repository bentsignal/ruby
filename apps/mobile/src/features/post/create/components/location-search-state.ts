import { useLocationSearchState } from "@acme/features/post-create/location-search-state";

import { useCreateStore } from "../store";

export function useLocationSearch({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}) {
  const setLocation = useCreateStore((store) => store.setLocation);

  return useLocationSearchState({ isOpen, onOpenChange, setLocation });
}
