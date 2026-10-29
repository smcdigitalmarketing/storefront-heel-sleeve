import { LayoutGridIcon } from "lucide-react";
import { Link } from "react-router";

import { CollectionCard } from "~/components/CollectionCard";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "~/components/ui/breadcrumb";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "~/components/ui/empty";
import { loadCollectionsPage } from "~/lib/collections";
import { storefrontClientContext } from "~/lib/storefront";
import { formatPageTitle, getShopNameFromRootMatch } from "~/lib/storefront-shop";

import type { Route } from "./+types/collections";

export function meta({ matches }: Route.MetaArgs) {
  const shopName = getShopNameFromRootMatch(matches[0]);
  return [
    { title: formatPageTitle("Collections", shopName) },
    {
      name: "description",
      content: `Browse all ${shopName} collections.`,
    },
  ];
}

export async function loader({ context, request }: Route.LoaderArgs) {
  const storefrontClient = context.get(storefrontClientContext);
  return loadCollectionsPage({ storefrontClient, request });
}

type CollectionNode = Route.ComponentProps["loaderData"]["collections"]["nodes"][number];

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
        name: "Collections",
        item: `${origin}/collections`,
      },
    ],
  };

  return <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>;
}

function CollectionsBreadcrumb() {
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
          <BreadcrumbPage className="font-medium">Collections</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CollectionsGrid({ collections }: { collections: readonly CollectionNode[] }) {
  if (collections.length === 0) {
    return (
      <Empty className="bg-muted border">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <LayoutGridIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>
            <h2>No collections found</h2>
          </EmptyTitle>
          <EmptyDescription>No collections available.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <>
      <h2 className="sr-only">Browse collections</h2>
      <div>
        <ul role="list" className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <li key={collection.handle}>
              <CollectionCard collection={collection} priority={index === 0} />
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default function CollectionsRoute({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex-1" id="main-content" tabIndex={-1}>
      <div className="mx-auto w-full max-w-7xl px-4 py-8 md:py-12">
        <BreadcrumbJsonLd origin={loaderData.origin} />
        <CollectionsBreadcrumb />
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
            Collections
          </h1>
        </div>
        <CollectionsGrid collections={loaderData.collections.nodes} />
      </div>
    </main>
  );
}
