import type { RefObject } from "react";
import { useState } from "react";
import { ImagePlus } from "lucide-react";

import { cn } from "@acme/std/cn";

export function ComposerDropzone({
  inputRef,
  isVisible,
  onFiles,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  isVisible: boolean;
  onFiles: (files: FileList) => void;
}) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  if (!isVisible) return null;

  return (
    <button
      type="button"
      className={cn(
        "border-border bg-card hover:bg-accent/60 flex min-h-52 w-full flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-6 text-center transition-colors",
        isDraggingOver && "border-primary bg-primary/10",
      )}
      onClick={() => inputRef.current?.click()}
      onDragLeave={() => setIsDraggingOver(false)}
      onDragOver={(event) => {
        event.preventDefault();
        setIsDraggingOver(true);
      }}
      onDrop={(event) => {
        event.preventDefault();
        setIsDraggingOver(false);
        onFiles(event.dataTransfer.files);
      }}
    >
      <span className="bg-primary/10 text-primary flex size-12 items-center justify-center rounded-full">
        <ImagePlus className="size-6" />
      </span>
      <span className="text-foreground text-base font-semibold">
        Click to upload, or drop files here
      </span>
    </button>
  );
}
