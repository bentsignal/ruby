import type { RefObject } from "react";

import { POST_UPLOAD_ACCEPT } from "@acme/config/posts";

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
      accept={POST_UPLOAD_ACCEPT}
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
