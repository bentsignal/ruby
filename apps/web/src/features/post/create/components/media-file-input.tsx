import { POST_UPLOAD_ACCEPT } from "@acme/config/posts";

import { useCreateStore } from "../store";

export function MediaFileInput() {
  const addFiles = useCreateStore((store) => store.addFiles);
  const inputRef = useCreateStore((store) => store.inputRef);

  return (
    <input
      ref={inputRef}
      accept={POST_UPLOAD_ACCEPT}
      className="sr-only"
      multiple
      type="file"
      onChange={(event) => {
        if (event.target.files) addFiles(event.target.files);
        event.target.value = "";
      }}
    />
  );
}
