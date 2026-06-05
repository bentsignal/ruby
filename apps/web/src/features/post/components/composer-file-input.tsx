import type { RefObject } from "react";

export function ComposerFileInput({
  inputRef,
  onFiles,
}: {
  inputRef: RefObject<HTMLInputElement | null>;
  onFiles: (files: FileList) => void;
}) {
  return (
    <input
      ref={inputRef}
      accept="image/*,video/*"
      className="sr-only"
      multiple
      type="file"
      onChange={(event) => {
        if (event.target.files) onFiles(event.target.files);
        event.target.value = "";
      }}
    />
  );
}
