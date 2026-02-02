import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod/v4";

import * as Search from "~/features/search/atom";
import { SearchPageResults } from "~/features/search/molecules/search-page-results";
import { MainLayout } from "~/layouts/main";
import { getAuth, redirectIfNotLoggedIn } from "~/lib/auth-server";

const searchParamsSchema = z.object({
  q: z.string().optional(),
});

export const Route = createFileRoute("/_tabs/search")({
  validateSearch: searchParamsSchema,
  beforeLoad: async () => {
    const token = await getAuth();
    if (!token) {
      redirectIfNotLoggedIn({ redirectURL: "/search" });
    }
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();

  return (
    <Search.Store initialSearchTerm={q} storeSearchTermInURL={true}>
      <MainLayout className="max-h-screen overflow-hidden">
        <SearchPageResults />
      </MainLayout>
    </Search.Store>
  );
}
