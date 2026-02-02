import Link from "next/link";

import { Button } from "@acme/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-4xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          We apologize, but the page you're looking for doesn't exist or has
          been moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/" prefetch>
          Back to home
        </Link>
      </Button>
    </div>
  );
}
