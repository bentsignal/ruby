import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_authed/create")({
  component: CreatePage,
});

function CreatePage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1 className="text-foreground text-2xl font-bold">Create</h1>
    </div>
  );
}
