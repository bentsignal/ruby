import { redirectIfNotLoggedIn } from "~/lib/auth-server";

export default async function CreatePage() {
  await redirectIfNotLoggedIn({ redirectURL: "/create" });
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-foreground text-2xl font-bold">Create</h1>
    </div>
  );
}
