import { env } from "~/env";

const forwardAuthRequest = (request: Request) => {
  const requestUrl = new URL(request.url);
  const forwardUrl = `${env.NEXT_PUBLIC_CONVEX_SITE_URL}${requestUrl.pathname}${requestUrl.search}`;
  const newRequest = new Request(forwardUrl, request);
  newRequest.headers.set("accept-encoding", "application/json");
  if (env.NODE_ENV === "production") {
    newRequest.headers.set("x-skip-oauth-proxy", "1");
  }
  return fetch(newRequest, { method: request.method, redirect: "manual" });
};

export const GET = (request: Request) => forwardAuthRequest(request);
export const POST = (request: Request) => forwardAuthRequest(request);
