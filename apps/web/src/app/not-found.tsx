import Link from "next/link";
import { House } from "lucide-react";

import { Button } from "@acme/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground max-w-md">
          Sorry about that, but we couldn't find the page you're looking for. It
          either doesn't exist anymore, or has been moved.
        </p>
      </div>
      <Button asChild>
        <Link href="/" prefetch>
          <House size={16} strokeWidth={2} />
          <span className="font-bold">Back to home</span>
        </Link>
      </Button>
    </div>
  );
}
