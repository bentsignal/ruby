import { Login } from "~/components/login";
import { isAuthenticated } from "~/lib/auth-server";

export default async function HomePage() {
  const authed = await isAuthenticated();
  if (authed) {
    return (
      <div className="text-foreground flex h-screen w-screen items-center justify-center text-2xl font-bold">
        Home
      </div>
    );
  }
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <Login />
    </div>
  );
}
