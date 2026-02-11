import { createFileRoute, Link } from "@tanstack/react-router";
import { LogIn } from "lucide-react";
import { z } from "zod";

import { Button } from "@acme/ui/button";

import { useAuthStore } from "~/features/auth/store";
import { PostList } from "~/features/post/molecules/post-list";

export const Route = createFileRoute("/_tabs/")({
  component: HomePage,
  validateSearch: z.object({
    signedOut: z.boolean().optional(),
  }),
});

function HomePage() {
  const imNotSignedIn = useAuthStore((s) => s.imSignedOut);
  const urlSaysSignedOut = Route.useSearch({
    select: (s) => s.signedOut ?? false,
  });

  if (imNotSignedIn || urlSaysSignedOut) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2">
        <p className="text-foreground mx-4 text-center text-2xl font-bold">
          You must be logged into view this page
        </p>
        <Button asChild>
          <Link to="/login">
            <LogIn size={16} />
            <span className="font-bold">Login</span>
          </Link>
        </Button>
      </div>
    );
  }

  return <PostList />;
}
