import { POST_CAPTION_MAX_LENGTH } from "@acme/config/posts";

export function ComposerCaptionField({
  caption,
  setCaption,
}: {
  caption: string;
  setCaption: (caption: string) => void;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold">Caption</span>
      <textarea
        className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-36 w-full resize-none rounded-lg border px-3 py-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        maxLength={POST_CAPTION_MAX_LENGTH}
        placeholder="Tell the story behind this stop..."
        value={caption}
        onChange={(event) => setCaption(event.target.value)}
      />
      <span className="text-muted-foreground self-end text-xs">
        {caption.length}/{POST_CAPTION_MAX_LENGTH}
      </span>
    </label>
  );
}
