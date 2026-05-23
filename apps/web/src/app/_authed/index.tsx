import { createFileRoute } from "@tanstack/react-router";

import { PostList } from "~/features/post/molecules/post-list";

export const Route = createFileRoute("/_authed/")({
  component: PostList,
});
