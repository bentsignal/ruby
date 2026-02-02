import { createFileRoute } from "@tanstack/react-router";

import { getAuth, redirectIfNotLoggedIn } from "~/lib/auth-server";

export const Route = createFileRoute("/_tabs/create")({
  beforeLoad: async () => {
    const token = await getAuth();
    if (!token) {
      redirectIfNotLoggedIn({ redirectURL: "/create" });
    }
  },
  component: CreatePage,
});

function CreatePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-foreground text-2xl font-bold">Create</h1>
    </div>
  );
}
