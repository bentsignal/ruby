import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useConvex } from "convex/react";
import { makeFunctionReference } from "convex/server";

import type { UIFile } from "@acme/convex/types";
import { Button } from "@acme/ui-web/button";

export const Route = createFileRoute("/_authed/create")({
  component: CreatePage,
});

const createUpload = makeFunctionReference<
  "action",
  {
    contentType: string;
    fileName: string;
    size: number;
  },
  {
    fileId: string;
    uploadUrl: string;
  }
>("files:createUpload");

function isUploadFile(value: unknown): value is UIFile {
  if (!(value instanceof Object)) return false;
  return (
    "contentType" in value &&
    typeof value.contentType === "string" &&
    "mediaType" in value &&
    (value.mediaType === "image" || value.mediaType === "video") &&
    "url" in value &&
    typeof value.url === "string"
  );
}

function getUploadResult(value: unknown) {
  if (!(value instanceof Object)) return { error: "Upload failed" };
  if ("error" in value && typeof value.error === "string") {
    return { error: value.error };
  }
  if ("file" in value && isUploadFile(value.file)) {
    return { file: value.file };
  }
  return { error: "Upload failed" };
}

function CreatePage() {
  const convex = useConvex();
  const [file, setFile] = useState<File | null>(null);
  const [uploadedFile, setUploadedFile] = useState<UIFile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  async function uploadFile() {
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadedFile(null);

    try {
      const { uploadUrl } = await convex.action(createUpload, {
        contentType: file.type || "application/octet-stream",
        fileName: file.name,
        size: file.size,
      });
      const response = await fetch(uploadUrl, {
        method: "POST",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });
      const result = getUploadResult(await response.json());
      if (!response.ok || "error" in result) {
        throw new Error("error" in result ? result.error : "Upload failed");
      }
      setUploadedFile(result.file);
      setIsUploading(false);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Upload failed";
      setError(message);
      setIsUploading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-xl flex-col gap-4 p-6">
      <h1 className="text-foreground text-2xl font-bold">Create</h1>
      <div className="border-border bg-card flex flex-col gap-4 rounded-lg border p-4">
        <input
          className="text-sm"
          type="file"
          accept="image/*,video/*"
          onChange={(event) => setFile(event.target.files?.[0] ?? null)}
        />
        <Button disabled={!file || isUploading} onClick={uploadFile}>
          {isUploading ? "Uploading..." : "Upload test file"}
        </Button>
        {error && <p className="text-destructive text-sm">{error}</p>}
        {uploadedFile && (
          <div className="text-muted-foreground flex flex-col gap-1 text-sm">
            <span className="text-foreground font-semibold">
              Uploaded {uploadedFile.mediaType}
            </span>
            <a
              className="text-primary break-all underline"
              href={uploadedFile.url}
              target="_blank"
              rel="noreferrer"
            >
              {uploadedFile.url}
            </a>
            <span>{uploadedFile.contentType}</span>
          </div>
        )}
      </div>
    </div>
  );
}
