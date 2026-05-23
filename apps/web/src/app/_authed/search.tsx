import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

import { SearchPageResults } from "~/features/search/molecules/search-page-results";
import { SearchStore } from "~/features/search/store";

export const Route = createFileRoute("/_authed/search")({
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  component: SearchPage,
});

function SearchPage() {
  const q = Route.useSearch({ select: (s) => s.q });

  return (
    <SearchStore initialSearchTerm={q} storeSearchTermInURL={true}>
      <SearchPageResults />
    </SearchStore>
  );
}
