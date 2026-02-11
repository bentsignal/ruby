import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod/v4";

import { SearchPageResults } from "~/features/search/molecules/search-page-results";
import { SearchStore } from "~/features/search/store";
import { MainLayout } from "~/layouts/main";

export const Route = createFileRoute("/_tabs/search")({
  validateSearch: z.object({
    q: z.string().optional(),
  }),
  beforeLoad: ({ context }) => {
    if (!context.isAuthenticated) {
      throw redirect({
        to: "/login",
        search: { redirect_uri: "/search" },
      });
    }
  },
  component: SearchPage,
});

function SearchPage() {
  const q = Route.useSearch({ select: (s) => s.q });

  return (
    <SearchStore initialSearchTerm={q} storeSearchTermInURL={true}>
      <MainLayout className="max-h-screen overflow-hidden">
        <SearchPageResults />
      </MainLayout>
    </SearchStore>
  );
}
