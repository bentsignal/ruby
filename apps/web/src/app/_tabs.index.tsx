import { createFileRoute, Link } from "@tanstack/react-router";
import { Loader, LogIn } from "lucide-react";

import { Button } from "@acme/ui/button";

import * as Auth from "~/features/auth/atom";
import { PostList } from "~/features/post/post-list";

export const Route = createFileRoute("/_tabs/")({
  component: HomePage,
});

function HomePage() {
  const imNotSignedIn = Auth.useStore((s) => s.imSignedOut);
  const isAuthLoading = Auth.useStore((s) => s.isLoading);

  if (isAuthLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <Loader className="size-6 animate-spin" />
      </div>
    );
  }

  if (imNotSignedIn) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <p className="text-foreground text-2xl font-bold">
          You must be logged into view this page.
        </p>
        <Button asChild>
          <Link to="/" search={{ showLogin: true }}>
            <LogIn size={16} />
            <span className="font-bold">Login</span>
          </Link>
        </Button>
      </div>
    );
  }

  return <PostList />;
}
