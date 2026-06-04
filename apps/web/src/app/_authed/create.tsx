import { createFileRoute } from "@tanstack/react-router";

import { CreateComposer } from "~/features/post/components/create-composer";

export const Route = createFileRoute("/_authed/create")({
  component: CreateComposer,
});
