import { Plus } from "lucide-react";

import { useCreateStore } from "../../store";

export function AddMoreMediaTile() {
  const inputRef = useCreateStore((store) => store.inputRef);

  return (
    <button
      type="button"
      className="border-border text-muted-foreground hover:bg-accent hover:text-foreground flex aspect-[4/5] flex-col items-center justify-center gap-2 rounded-lg border border-dashed transition-colors"
      onClick={() => inputRef.current?.click()}
    >
      <Plus className="size-6" />
      <span className="text-sm font-semibold">Add more</span>
    </button>
  );
}
