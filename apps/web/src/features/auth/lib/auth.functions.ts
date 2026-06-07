import { createServerFn } from "@tanstack/react-start";

import { api } from "@acme/convex/api";

import { fetchAuthMutation, getToken } from "~/features/auth/lib/auth.server";

export const getAuth = createServerFn({ method: "GET" }).handler(async () => {
  return await getToken();
});

export const ensureProfileExists = createServerFn({
  method: "GET",
}).handler(async () => {
  return await fetchAuthMutation(api.profile.mutations.ensureProfileExists, {});
});
