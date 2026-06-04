import { ConvexError } from "convex/values";

import { storageEnv } from "./storage.env";

function normalizePublicUrl(publicUrl: string) {
  return publicUrl.replace(/\/+$/, "");
}

function requireEnv(value: string | undefined, name: string) {
  if (!value) throw new ConvexError(`Missing ${name}`);
  return value;
}

function createStorageUrl(key: string) {
  const zoneName = requireEnv(
    storageEnv.BUNNY_STORAGE_ZONE_NAME,
    "BUNNY_STORAGE_ZONE_NAME",
  );
  const endpoint = requireEnv(
    storageEnv.BUNNY_STORAGE_HOSTNAME,
    "BUNNY_STORAGE_HOSTNAME",
  );
  const url = new URL(
    endpoint.startsWith("http") ? endpoint : `https://${endpoint}`,
  );

  url.pathname = `/${zoneName}/${key}`;
  return url.toString();
}

export function createPublicUrl(key: string) {
  const publicUrl = requireEnv(
    storageEnv.BUNNY_STORAGE_PUBLIC_URL,
    "BUNNY_STORAGE_PUBLIC_URL",
  );
  return `${normalizePublicUrl(publicUrl)}/${key}`;
}

export async function uploadToBunny({
  body,
  contentType,
  key,
}: {
  body: ArrayBuffer;
  contentType: string;
  key: string;
}) {
  const response = await fetch(createStorageUrl(key), {
    method: "PUT",
    headers: {
      AccessKey: requireEnv(
        storageEnv.BUNNY_STORAGE_ACCESS_KEY,
        "BUNNY_STORAGE_ACCESS_KEY",
      ),
      "Content-Type": contentType,
    },
    body,
  });

  if (!response.ok) {
    throw new ConvexError(`Bunny upload failed with status ${response.status}`);
  }
}
