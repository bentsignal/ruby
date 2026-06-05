export interface ComposerItem {
  id: string;
  file: File;
  previewUrl: string;
  status: "ready" | "uploading" | "uploaded" | "error";
  error?: string;
}
