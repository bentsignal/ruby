import { redirectIfNotLoggedIn } from "~/lib/auth-server";

export default async function NotificationsPage() {
  await redirectIfNotLoggedIn({ redirectURL: "/notifications" });
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-foreground text-2xl font-bold">Notifications</h1>
    </div>
  );
}
