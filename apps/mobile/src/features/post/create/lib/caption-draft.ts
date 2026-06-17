let captionDraft = "";

export function readCaptionDraft() {
  return captionDraft;
}

export function resetCaptionDraft() {
  captionDraft = "";
}

export function writeCaptionDraft(nextCaption: string) {
  captionDraft = nextCaption;
}
