import { createFileRoute } from "@tanstack/react-router";

import { getAuth, redirectIfNotLoggedIn } from "~/lib/auth-server";

export const Route = createFileRoute("/_tabs/notifications")({
  beforeLoad: async () => {
    const token = await getAuth();
    if (!token) {
      redirectIfNotLoggedIn({ redirectURL: "/notifications" });
    }
  },
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-foreground text-2xl font-bold">Notifications</h1>
    </div>
  );
}
