import { AnalyticsEvent, getSortByValue } from "@shopify/hydrogen";
import { CollectionProvider } from "@shopify/hydrogen/react";
import { PackageSearchIcon } from "lucide-react";
import { useEffect } from "react";
import { Link, useLocation, useNavigate, useNavigation, useSearchParams } from "react-router";

import {
  ActiveFilterChips,
  COLLECTION_SORT_OPTIONS,
  FacetForm,
  FilterDrawer,
  LoadMore,
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
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { loadCollectionPage } from "~/lib/collection";
import { storefrontClientContext } from "~/lib/storefront";
import { formatPageTitle, getShopNameFromRootMatch } from "~/lib/storefront-shop";
import { cn } from "~/lib/utils";

import type { Route } from "./+types/collection";

export function meta({ matches }: Route.MetaArgs) {
  const shopName = getShopNameFromRootMatch(matches[0]);
  return [
    { title: formatPageTitle("Collection", shopName) },
    {
      name: "description",
      content: `Shop the ${shopName} collection page.`,
    },
  ];
}

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const handle = params.handle;
  if (!handle) throw new Response("Not Found", { status: 404 });

  const storefrontClient = context.get(storefrontClientContext);
  return loadCollectionPage({ storefrontClient, handle, request });
}

type CollectionData = Route.ComponentProps["loaderData"]["collection"];
type ProductNode = Route.ComponentProps["loaderData"]["products"][number];

function CollectionViewedTracker({ collection }: { collection: CollectionData }) {
  useEffect(() => {
    window.Shopify?.analytics?.publish(AnalyticsEvent.COLLECTION_VIEWED, {
      collection: {
        id: collection.id,
        handle: collection.handle,
      },
    });
  }, [collection.id, collection.handle]);

  return null;
}

function BreadcrumbJsonLd({ collection, origin }: { collection: CollectionData; origin: string }) {
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
        name: collection.title,
        item: `${origin}/collections/${collection.handle}`,
      },
    ],
  };

  return <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>;
}

function CollectionBreadcrumb({ collection }: { collection: CollectionData }) {
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
          <BreadcrumbPage className="font-medium">{collection.title}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CollectionHeader({ collection }: { collection: CollectionData }) {
  return (
    <div className="mb-8">
      <div className="grid gap-6 md:grid-cols-[1fr_16rem] md:items-start">
        <div>
          <h1 className="font-heading mb-2 text-4xl font-semibold tracking-tight md:text-5xl">
            {collection.title}
          </h1>
          {collection.description ? (
            <div className="text-muted-foreground max-w-2xl text-sm [&_a]:underline [&_p]:mb-4">
              <p>{collection.description}</p>
            </div>
          ) : null}
        </div>
        {collection.image ? (
          <div className="bg-muted aspect-video overflow-hidden rounded-lg">
            <img
              src={collection.image.url}
              alt={collection.image.altText ?? collection.title}
              width={collection.image.width ?? undefined}
              height={collection.image.height ?? undefined}
              className="h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

function ProductGrid({ products }: { products: readonly ProductNode[] }) {
  if (products.length === 0) return null;

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

function EmptyState({ collectionPath }: { collectionPath: string }) {
  return (
    <Empty className="bg-muted border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageSearchIcon aria-hidden="true" />
        </EmptyMedia>
        <EmptyTitle>
          <h2>No products found</h2>
        </EmptyTitle>
        <EmptyDescription>
          Try removing filters to see more products in this collection.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild className="h-11 px-4">
          <Link to={collectionPath} preventScrollReset>
            Clear all filters
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}

function CollectionResults({ loaderData }: { loaderData: Route.ComponentProps["loaderData"] }) {
  const location = useLocation();
  const navigation = useNavigation();
  const isUpdating =
    navigation.state === "loading" &&
    navigation.location?.pathname === location.pathname &&
    navigation.location.search !== location.search;
  const collectionPath = `/collections/${loaderData.collection.handle}`;
  const { nodes, pageInfo, isLoading, loadMore } = useLoadMore(
    loaderData.products,
    loaderData.pageInfo,
    loaderData.dataSearch,
  );
  const countText = `Showing ${nodes.length}`;
  const defaultSortValue = getSortByValue("COLLECTION_DEFAULT", false);

  return (
    <>
      <Toolbar
        countText={countText}
        sortOptions={COLLECTION_SORT_OPTIONS}
        defaultSortValue={defaultSortValue}
        filterDrawer={
          <FilterDrawer
            availableFilters={loaderData.availableFilters}
            currencyCode={loaderData.currencyCode}
          />
        }
      />
      <ActiveFilterChips
        basePath={collectionPath}
        clearAllTo={collectionPath}
        currencyCode={loaderData.currencyCode}
      />
      <h2 className="sr-only">Products</h2>
      <div
        aria-busy={isUpdating}
        className={cn(
          "motion-safe:transition-opacity motion-safe:duration-150",
          isUpdating ? "opacity-60" : "opacity-100",
        )}
      >
        {nodes.length > 0 ? (
          <ProductGrid products={nodes} />
        ) : (
          <EmptyState collectionPath={collectionPath} />
        )}
      </div>
      <LoadMore
        pageInfo={pageInfo}
        loadedCount={nodes.length}
        countLabel={`Showing ${nodes.length} products`}
        isLoading={isLoading}
        onLoad={loadMore}
      />
    </>
  );
}

export default function CollectionRoute({ loaderData }: Route.ComponentProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  return (
    <CollectionProvider
      data={{ handle: loaderData.collection.handle, dataSearch: loaderData.dataSearch }}
      urlSearch={searchParams.toString()}
      onChange={(search) => {
        const nextParams = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
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
      <CollectionViewedTracker collection={loaderData.collection} />
      <main className="flex-1" id="main-content" tabIndex={-1}>
        <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
          <BreadcrumbJsonLd collection={loaderData.collection} origin={loaderData.origin} />
          <CollectionBreadcrumb collection={loaderData.collection} />
          <CollectionHeader collection={loaderData.collection} />
          <div className="lg:grid lg:grid-cols-[15rem_1fr] lg:gap-10">
            <aside className="hidden lg:block noscript:block" aria-label="Filters">
              <div className="sticky top-8">
                <h2 className="font-heading mb-2 text-lg font-semibold tracking-tight">Filters</h2>
                <FacetForm
                  availableFilters={loaderData.availableFilters}
                  currencyCode={loaderData.currencyCode}
                />
              </div>
            </aside>
            <div>
              <CollectionResults loaderData={loaderData} />
            </div>
          </div>
        </div>
      </main>
    </CollectionProvider>
  );
}
