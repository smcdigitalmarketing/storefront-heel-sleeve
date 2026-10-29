import { gql } from "@shopify/hydrogen";
import { ArrowRightIcon } from "lucide-react";
import { Link, useRouteLoaderData } from "react-router";

import {
  CollectionCard,
  COLLECTION_CARD_FRAGMENT,
  type CollectionCardData,
} from "~/components/CollectionCard";
import { HomeHero } from "~/components/HomeHero";
import {
  ProductCard,
  PRODUCT_CARD_FRAGMENT,
  type ProductCardData,
} from "~/components/ProductCard";
import { Button } from "~/components/ui/button";
import { selectHomeHero } from "~/lib/home-hero";
import { storefrontClientContext } from "~/lib/storefront";
import {
  FALLBACK_SHOP_NAME,
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";
import type { loader as rootLoader } from "~/root";

import type { Route } from "./+types/home";

const HOME_QUERY = gql(
  `
    query Home {
      products(first: 8, sortKey: CREATED_AT, reverse: true) {
        nodes {
          ...ProductCard
        }
      }
      collections(first: 3) {
        nodes {
          ...CollectionCard
        }
      }
      heroCollections: collections(first: 1, sortKey: UPDATED_AT, reverse: true) {
        nodes {
          title
          handle
          description
          image {
            url
            altText
          }
          products(first: 1) {
            nodes {
              featuredImage {
                url
                altText
              }
            }
          }
        }
      }
    }
  `,
  [PRODUCT_CARD_FRAGMENT, COLLECTION_CARD_FRAGMENT],
);

export function meta({ matches }: Route.MetaArgs) {
  const shopName = getShopNameFromRootMatch(matches[0]);
  return [
    { title: formatPageTitle("Home", shopName) },
    {
      name: "description",
      content: `Shop new arrivals and featured categories at ${shopName}.`,
    },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const storefrontClient = context.get(storefrontClientContext);
  const { data } = await storefrontClient.graphql(HOME_QUERY);

  // New arrivals: the most recently created products (by creation date, not
  // publication date), newest first, in the order the Storefront API returns.
  const featuredProducts: ProductCardData[] = data?.products.nodes ?? [];
  const featuredCollections: CollectionCardData[] =
    data?.collections.nodes ?? [];
  // The hero features the most recently updated collection, independent of the
  // category list above.
  const heroCollections = data?.heroCollections.nodes ?? [];

  return {
    featuredProducts,
    featuredCollections,
    heroCollections,
  };
}

function NewArrivals({ products }: { products: readonly ProductCardData[] }) {
  return (
    <section
      className="bg-background w-full pt-20 pb-12"
      aria-labelledby="new-arrivals-heading"
    >
      <div className="mx-auto mb-4 flex max-w-7xl items-center justify-between gap-4 px-4">
        <h2
          id="new-arrivals-heading"
          className="font-heading text-3xl font-semibold tracking-tight"
        >
          New arrivals
        </h2>
        <Button
          asChild
          variant="link"
          className="text-foreground h-11 px-0 font-normal"
        >
          <Link to="/collections">
            Collections
            <ArrowRightIcon data-icon="inline-end" aria-hidden="true" />
          </Link>
        </Button>
      </div>

      {products.length > 0 ? (
        <div className="mx-auto max-w-7xl px-4 contain-paint">
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product) => (
              <li key={product.handle}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function ShopByCategory({
  collections,
}: {
  collections: readonly CollectionCardData[];
}) {
  return (
    <section className="w-full py-12" aria-labelledby="category-heading">
      <h2
        id="category-heading"
        className="font-heading mx-auto mb-4 max-w-7xl px-4 text-3xl font-semibold tracking-tight"
      >
        Shop by category
      </h2>
      {collections.length > 0 ? (
        <ul
          role="list"
          className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 md:grid-cols-3"
        >
          {collections.map((collection) => (
            <li key={collection.handle}>
              <CollectionCard collection={collection} />
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  const hero = selectHomeHero(
    loaderData.heroCollections,
    rootData?.shopInfo.name ?? FALLBACK_SHOP_NAME,
  );

  return (
    <main className="flex-1" id="main-content" tabIndex={-1}>
      <HomeHero hero={hero} />
      <NewArrivals products={loaderData.featuredProducts} />
      <ShopByCategory collections={loaderData.featuredCollections} />
    </main>
  );
}
