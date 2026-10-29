import {
  AnalyticsEvent,
  createPredictiveSearchFormRegister,
  getSortByValue,
} from "@shopify/hydrogen";
import { CollectionProvider } from "@shopify/hydrogen/react";
import { SearchIcon, SearchXIcon, XIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate, useNavigation, useSearchParams } from "react-router";

import {
  ActiveFilterChips,
  FacetForm,
  FilterDrawer,
  LoadMore,
  SEARCH_SORT_OPTIONS,
  Toolbar,
  useLoadMore,
} from "~/components/CollectionBrowse";
import { ProductCard } from "~/components/ProductCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import { Button } from "~/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";
import { loadSearchPage, type SearchPageData } from "~/lib/search";
import { storefrontClientContext } from "~/lib/storefront";
import { formatPageTitle, getShopNameFromRootMatch } from "~/lib/storefront-shop";
import { cn } from "~/lib/utils";

import type { Route } from "./+types/search";

export function meta({ matches }: Route.MetaArgs) {
  const shopName = getShopNameFromRootMatch(matches[0]);
  return [
    { title: formatPageTitle("Search", shopName) },
    {
      name: "description",
      content: `Search products at ${shopName}.`,
    },
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const storefrontClient = context.get(storefrontClientContext);
  return loadSearchPage({ storefrontClient, request });
}

type PerformedSearchData = Extract<SearchPageData, { performed: true }>;
type ProductNode = PerformedSearchData["products"][number];

function SearchViewedTracker({
  searchTerm,
  totalCount,
}: {
  searchTerm: string;
  totalCount: number;
}) {
  useEffect(() => {
    if (!searchTerm) return;

    window.Shopify?.analytics?.publish(AnalyticsEvent.SEARCH_VIEWED, {
      searchTerm,
      searchResults: { totalCount },
    });
  }, [searchTerm, totalCount]);

  return null;
}

function BreadcrumbJsonLd({ origin }: { origin: string }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: `${origin}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Search",
        item: `${origin}/search`,
      },
    ],
  };

  return <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>;
}

function SearchBreadcrumb() {
  return (
    <Breadcrumb aria-label="Breadcrumb" className="mb-6">
      <BreadcrumbList className="gap-1.5 sm:gap-1.5">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              to="/"
              className="focus-visible:ring-ring/50 rounded-sm py-2 outline-none focus-visible:ring-3"
            >
              Home
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>/</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage className="font-medium">Search</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

const registerSearchForm = createPredictiveSearchFormRegister();

function SearchHeader({ term }: { term: string }) {
  return (
    <div className="mb-8">
      <h1 className="font-heading mb-6 text-4xl font-semibold tracking-tight md:text-5xl">
        Search
      </h1>
      <form
        action="/search"
        method="get"
        role="search"
        aria-label="Search"
        className="mb-8 max-w-lg"
      >
        <Label htmlFor="search-q" className="mb-1.5">
          Search
        </Label>
        <InputGroup className="h-11">
          <InputGroupAddon>
            <SearchIcon className="size-5" aria-hidden="true" />
          </InputGroupAddon>
          <InputGroupInput
            key={term}
            {...registerSearchForm("query")}
            id="search-q"
            defaultValue={term}
            placeholder="Search"
          />
          {term ? (
            <InputGroupAddon align="inline-end">
              {/* The ::after widens the hit area to 44px without growing the field. */}
              <Button
                asChild
                variant="ghost"
                size="icon-sm"
                className="relative after:absolute after:-inset-1.5"
              >
                <Link to="/search" aria-label="Clear search">
                  <XIcon aria-hidden="true" />
                </Link>
              </Button>
            </InputGroupAddon>
          ) : null}
        </InputGroup>
      </form>
    </div>
  );
}

function searchTermHiddenInput(term: string) {
  return <input type="hidden" name="q" value={term} />;
}

function ProductGrid({ products }: { products: readonly ProductNode[] }) {
  return (
    <div className="px-1 contain-paint">
      <ul
        id="product-grid"
        data-testid="product-grid"
        role="list"
        className="grid grid-cols-2 gap-x-1 gap-y-10 lg:grid-cols-3"
      >
        {products.map((product, index) => (
          <li key={`${product.handle}-${index}`}>
            <ProductCard product={product} priority={index < 3} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function NoResults({ term }: { term: string }) {
  return (
    <Empty className="bg-muted border" aria-live="polite">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <SearchXIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>No results for “{term}”</EmptyTitle>
        <EmptyDescription>Check your spelling or try a more general term.</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}

function SearchResults({ loaderData }: { loaderData: PerformedSearchData }) {
  const location = useLocation();
  const navigation = useNavigation();
  const isUpdating =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname &&
    navigation.location.search !== location.search;
  const { nodes, pageInfo, isLoading, loadMore } = useLoadMore(
    loaderData.products,
    loaderData.pageInfo,
    loaderData.dataSearch,
  );
  const defaultSortValue = getSortByValue("RELEVANCE", false);
  const countText = `${nodes.length} results found for “${loaderData.searchTerm}”`;
  const searchPath = `/search?q=${encodeURIComponent(loaderData.searchTerm)}`;
  const hiddenQuery = searchTermHiddenInput(loaderData.searchTerm);

  if (nodes.length === 0) return <NoResults term={loaderData.searchTerm} />;

  return (
    <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
      <aside className="hidden lg:block noscript:block" aria-label="Filters">
        <div className="sticky top-8">
          <h2 className="font-heading mb-2 text-lg font-semibold tracking-tight">Filters</h2>
          <FacetForm
            availableFilters={loaderData.availableFilters}
            currencyCode={loaderData.currencyCode}
            extraHiddenInputs={searchTermHiddenInput(loaderData.searchTerm)}
          />
        </div>
      </aside>
      <div>
        <Toolbar
          countText={countText}
          sortOptions={SEARCH_SORT_OPTIONS}
          defaultSortValue={defaultSortValue}
          extraHiddenInputs={hiddenQuery}
          filterDrawer={
            <FilterDrawer
              availableFilters={loaderData.availableFilters}
              currencyCode={loaderData.currencyCode}
              extraHiddenInputs={searchTermHiddenInput(loaderData.searchTerm)}
            />
          }
        />
        <ActiveFilterChips
          basePath={searchPath}
          clearAllTo={searchPath}
          currencyCode={loaderData.currencyCode}
        />
        <h2 className="sr-only">Search results</h2>
        <div
          aria-busy={isUpdating}
          className={cn(
            "motion-safe:transition-opacity motion-safe:duration-150",
            isUpdating ? "opacity-60" : "opacity-100",
          )}
        >
          <ProductGrid products={nodes} />
        </div>
        <LoadMore
          pageInfo={pageInfo}
          loadedCount={nodes.length}
          countLabel={`Showing ${nodes.length} of ${loaderData.totalCount} results`}
          isLoading={isLoading}
          onLoad={loadMore}
        />
      </div>
    </div>
  );
}

export default function SearchRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  return (
    <CollectionProvider
      data={{ handle: `search:${loaderData.searchTerm}`, dataSearch: loaderData.dataSearch }}
      urlSearch={searchParams.toString()}
      onChange={(search) => {
        const nextParams = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
        if (loaderData.searchTerm && !nextParams.has("q"))
          nextParams.set("q", loaderData.searchTerm);
        nextParams.delete("after");
        const nextSearch = nextParams.toString();
        void navigate(
          { search: nextSearch ? `?${nextSearch}` : "" },
          {
            replace: searchParams.size > 0,
            preventScrollReset: true,
          },
        );
      }}
    >
      {loaderData.performed ? (
        <SearchViewedTracker
          searchTerm={loaderData.searchTerm}
          totalCount={loaderData.totalCount}
        />
      ) : null}
      <main className="flex-1" id="main-content" tabIndex={-1}>
        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
          <BreadcrumbJsonLd origin={loaderData.origin} />
          <SearchBreadcrumb />
          <SearchHeader term={loaderData.searchTerm} />
          {loaderData.performed ? <SearchResults loaderData={loaderData} /> : null}
        </div>
      </main>
    </CollectionProvider>
  );
}
