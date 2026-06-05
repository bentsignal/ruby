import { useRef } from "react";

import { useCreateComposer } from "../hooks/use-create-composer";
import { ComposerCaptionField } from "./composer-caption-field";
import { ComposerDropzone } from "./composer-dropzone";
import { ComposerFileInput } from "./composer-file-input";
import { ComposerMediaGrid } from "./composer-media-grid";
import { ComposerHeader, ComposerPostActions } from "./composer-post-actions";

export function CreateComposer() {
  const inputRef = useRef<HTMLInputElement>(null);
  const composer = useCreateComposer();

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-5 px-4 pt-6 pb-28 sm:px-6 sm:pt-10">
      <ComposerHeader
        canPost={composer.canPost}
        onPost={composer.openConfirm}
      />
      <ComposerFileInput inputRef={inputRef} onFiles={composer.addFiles} />
      <ComposerDropzone
        inputRef={inputRef}
        isVisible={composer.items.length === 0}
        onFiles={composer.addFiles}
      />
      <ComposerMediaGrid
        inputRef={inputRef}
        items={composer.items}
        moveItem={composer.moveItem}
        removeItem={composer.removeItem}
      />
      <ComposerCaptionField
        caption={composer.caption}
        setCaption={composer.setCaption}
      />
      {composer.error && (
        <p className="text-destructive text-sm">{composer.error}</p>
      )}
      <ComposerPostActions
        canPost={composer.canPost}
        isConfirmOpen={composer.isConfirmOpen}
        isPosting={composer.isPosting}
        isUploading={composer.hasUploadingItems}
        onConfirmOpenChange={composer.setIsConfirmOpen}
        onPost={composer.publishPost}
        onPostIntent={composer.openConfirm}
      />
    </div>
  );
}
