import { gql, type StorefrontApi } from "@shopify/hydrogen";
import { Link } from "react-router";

export const COLLECTION_CARD_PRODUCT_COUNT_LIMIT = 100;

export const COLLECTION_CARD_FRAGMENT = gql(`
  fragment CollectionCard on Collection {
    handle
    title
    image {
      url
      altText
      width
      height
    }
    products(first: 1) {
      nodes {
        featuredImage {
          url
          altText
        }
      }
    }
    productCountProbe: products(first: 100) {
      nodes {
        id
      }
      pageInfo {
        hasNextPage
      }
    }
  }
`);

const COLLECTION_CARD_SHAPE_QUERY = gql(
  `query CollectionCardShape { collections(first: 1) { nodes { ...CollectionCard } } }`,
  [COLLECTION_CARD_FRAGMENT],
);

export type CollectionCardData = StorefrontApi.ResultOf<
  typeof COLLECTION_CARD_SHAPE_QUERY
>["collections"]["nodes"][number];

export type CollectionCardProps = {
  collection: CollectionCardData;
  priority?: boolean;
  productCount?: number;
  useProductImageFallback?: boolean;
};

function productCountText(collection: CollectionCardData, productCount?: number) {
  if (typeof productCount === "number") {
    return `${productCount} ${productCount === 1 ? "product" : "products"}`;
  }

  if (collection.productCountProbe.pageInfo.hasNextPage) {
    return `${COLLECTION_CARD_PRODUCT_COUNT_LIMIT}+ products`;
  }

  const count = collection.productCountProbe.nodes.length;
  return `${count} ${count === 1 ? "product" : "products"}`;
}

export function CollectionCard({
  collection,
  priority = false,
  productCount,
  useProductImageFallback = true,
}: CollectionCardProps) {
  const fallbackImage = useProductImageFallback
    ? (collection.products.nodes[0]?.featuredImage ?? null)
    : null;
  const image = collection.image ?? fallbackImage;
  const imageWidth = collection.image?.width ?? undefined;
  const imageHeight = collection.image?.height ?? undefined;

  return (
    <Link
      to={`/collections/${collection.handle}`}
      className="group focus-visible:ring-ring/50 relative block overflow-hidden rounded-lg no-underline outline-none focus-visible:ring-3"
      aria-label={collection.title}
      data-testid="collection-card"
    >
      <div className="bg-muted relative block aspect-square overflow-hidden">
        {image ? (
          <div className="h-full w-full motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:scale-[1.04]">
            <img
              src={image.url}
              alt=""
              width={imageWidth}
              height={imageHeight}
              className="h-full w-full object-cover"
              loading={priority ? "eager" : "lazy"}
              fetchPriority={priority ? "high" : "auto"}
            />
          </div>
        ) : null}
      </div>
      {/* Darkens the bottom of the image so the title stays readable. */}
      <div className="from-foreground/80 via-foreground/40 pointer-events-none absolute inset-0 bg-linear-to-t to-transparent" />
      <div className="text-background absolute inset-x-0 bottom-0 z-10 p-4 text-left">
        <h3 className="text-lg font-medium">{collection.title}</h3>
        <p className="mt-0.5 text-sm opacity-80">
          {productCountText(collection, productCount)}
        </p>
      </div>
    </Link>
  );
}
