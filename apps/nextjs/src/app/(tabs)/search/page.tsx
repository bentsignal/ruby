import * as Search from "~/features/search/atom";
import { SearchPageResults } from "~/features/search/molecules/search-page-results";
import { MainLayout } from "~/layouts/main";
import { redirectIfNotLoggedIn } from "~/lib/auth-server";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await redirectIfNotLoggedIn({ redirectURL: "/search" });
  const { q } = await searchParams;

  return (
    <Search.Store initialSearchTerm={q} storeSearchTermInURL={true}>
      <MainLayout className="max-h-screen overflow-hidden">
        <SearchPageResults />
      </MainLayout>
    </Search.Store>
  );
}
