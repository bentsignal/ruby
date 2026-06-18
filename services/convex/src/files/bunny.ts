import { ConvexError } from "convex/values";

import { env } from "../convex.env";

function normalizePublicUrl(publicUrl: string) {
  return publicUrl.replace(/\/+$/, "");
}

function createStorageUrl(key: string) {
  const endpoint = env.BUNNY_STORAGE_HOSTNAME;
  const url = new URL(
    endpoint.startsWith("http") ? endpoint : `https://${endpoint}`,
  );

  return new URL(`/${env.BUNNY_STORAGE_ZONE_NAME}/${key}`, url).toString();
}

export function createPublicUrl(key: string) {
  return `${normalizePublicUrl(env.BUNNY_STORAGE_PUBLIC_URL)}/${key}`;
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
      AccessKey: env.BUNNY_STORAGE_ACCESS_KEY,
      "Content-Type": contentType,
    },
    body,
  });

  if (!response.ok) {
    throw new ConvexError(`Bunny upload failed with status ${response.status}`);
  }
}
