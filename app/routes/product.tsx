import {
  AnalyticsEvent,
  buildProductSelectionSearchParams,
  canAddToCart,
  getSelectedProductOptions,
  gql,
  type SelectedOption,
} from "@shopify/hydrogen";
import { ShopPayButton } from "@shopify/hydrogen/react";
import { MinusIcon, PlusIcon, SlashIcon } from "lucide-react";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import { Link, useLocation, useNavigate } from "react-router";

import { ProductCard, PRODUCT_CARD_FRAGMENT } from "~/components/ProductCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { FieldLegend, FieldSet } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { openCartDrawer } from "~/lib/cart-drawer";
import { formatPrice, salePercent } from "~/lib/money";
import { ProductProvider, useProductForm } from "~/lib/product";
import { storefrontClientContext } from "~/lib/storefront";
import { cn } from "~/lib/utils";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/product";

const PRODUCT_VARIANT_FRAGMENT = gql(`
  fragment ProductVariantFields on ProductVariant {
    id
    title
    availableForSale
    selectedOptions {
      name
      value
    }
    price {
      amount
      currencyCode
    }
    compareAtPrice {
      amount
      currencyCode
    }
    image {
      id
      url
      altText
      width
      height
    }
    product {
      title
      handle
    }
    sku
  }
`);

const PRODUCT_QUERY = gql(
  `
    query ProductPage($handle: String!, $selectedOptions: [SelectedOptionInput!]!) {
      product(handle: $handle) {
        id
        handle
        title
        vendor
        description
        descriptionHtml
        requiresSellingPlan
        encodedVariantExistence
        encodedVariantAvailability
        featuredImage {
          id
          url
          altText
          width
          height
        }
        images(first: 8) {
          nodes {
            id
            url
            altText
            width
            height
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        options {
          name
          optionValues {
            name
            firstSelectableVariant {
              ...ProductVariantFields
            }
            swatch {
              color
              image {
                previewImage {
                  url
                }
              }
            }
          }
        }
        selectedOrFirstAvailableVariant(
          selectedOptions: $selectedOptions
          ignoreUnknownOptions: true
          caseInsensitiveMatch: true
        ) {
          ...ProductVariantFields
        }
        adjacentVariants(
          selectedOptions: $selectedOptions
          ignoreUnknownOptions: true
          caseInsensitiveMatch: true
        ) {
          ...ProductVariantFields
        }
      }
      products(first: 5) {
        nodes {
          ...ProductCard
        }
      }
    }
  `,
  [PRODUCT_VARIANT_FRAGMENT, PRODUCT_CARD_FRAGMENT],
);

export function meta({ matches }: Route.MetaArgs) {
  const shopName = getShopNameFromRootMatch(matches[0]);
  return [
    { title: formatPageTitle("Product", shopName) },
    {
      name: "description",
      content: `Shop the ${shopName} product detail page.`,
    },
  ];
}

export async function loader({ context, params, request }: Route.LoaderArgs) {
  const handle = params.handle;
  if (!handle) throw new Response("Not Found", { status: 404 });

  const storefrontClient = context.get(storefrontClientContext);
  const selectedOptions = getSelectedProductOptions({
    searchParams: new URL(request.url).searchParams,
  });
  const { data } = await storefrontClient.graphql(PRODUCT_QUERY, {
    variables: { handle, selectedOptions },
  });

  if (!data?.product) throw new Response("Not Found", { status: 404 });

  return {
    product: data.product,
    relatedProducts: data.products.nodes
      .filter((product) => product.handle !== data.product?.handle)
      .slice(0, 4),
  };
}

type ProductData = Route.ComponentProps["loaderData"]["product"];
type ProductVariant = NonNullable<
  ProductData["selectedOrFirstAvailableVariant"]
>;
type RelatedProduct =
  Route.ComponentProps["loaderData"]["relatedProducts"][number];

type ProductImage = {
  id?: string | null;
  url: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

type SwatchValue = {
  color?: string | null;
  imageUrl?: string | null;
};

function toRouterLocation(url: string) {
  return url;
}

function variantUrl(
  product: { handle: string; options: Array<{ name: string }> },
  selectedOptions: SelectedOption[],
  handle = product.handle,
  base: URLSearchParams = new URLSearchParams(),
) {
  const params = buildProductSelectionSearchParams({
    selectedOptions,
    optionNames: product.options.map((option) => option.name),
    base,
  });
  const query = params.toString();
  return `/products/${handle}${query ? `?${query}` : ""}`;
}

function buildSwatchLookup(product: ProductData) {
  const lookup = new Map<string, SwatchValue>();
  for (const option of product.options) {
    for (const value of option.optionValues) {
      const swatch = value.swatch;
      lookup.set(`${option.name}:${value.name}`, {
        color: swatch?.color ?? null,
        imageUrl: swatch?.image?.previewImage?.url ?? null,
      });
    }
  }
  return lookup;
}

function hasSwatchData(product: ProductData, optionName: string) {
  const option = product.options.find(
    (candidate) => candidate.name === optionName,
  );
  return Boolean(
    option?.optionValues.some(
      (value) => value.swatch?.color || value.swatch?.image?.previewImage?.url,
    ),
  );
}

function ProductViewedTracker({ product }: { product: ProductData }) {
  useEffect(() => {
    const selectedVariant = product.selectedOrFirstAvailableVariant;
    window.Shopify?.analytics?.publish(AnalyticsEvent.PRODUCT_VIEWED, {
      products: [
        {
          id: product.id,
          title: product.title,
          price: selectedVariant?.price ?? product.priceRange.minVariantPrice,
          vendor: product.vendor ?? "",
          variantId: selectedVariant?.id ?? product.id,
          variantTitle: selectedVariant?.title ?? product.title,
          quantity: 1,
          sku: selectedVariant?.sku,
        },
      ],
    });
  }, [product]);

  return null;
}

function useGalleryImages(
  product: ProductData,
  selectedVariant: ProductVariant | null,
) {
  return useMemo(() => {
    const images: ProductImage[] = [];
    const seen = new Set<string>();
    const addImage = (image: ProductImage | null | undefined) => {
      if (!image?.url || seen.has(image.url)) return;
      seen.add(image.url);
      images.push(image);
    };

    addImage(
      selectedVariant?.image ??
        product.featuredImage ??
        product.images.nodes[0],
    );
    for (const image of product.images.nodes) addImage(image);
    return images;
  }, [product, selectedVariant]);
}

function galleryDotClass(active: boolean) {
  if (active) return "bg-foreground size-2 rounded-full";
  return "bg-foreground/30 size-2 rounded-full";
}

function ProductGallery({
  product,
  selectedVariant,
}: {
  product: ProductData;
  selectedVariant: ProductVariant | null;
}) {
  const images = useGalleryImages(product, selectedVariant);
  const primaryImageUrl = images[0]?.url;
  const [api, setApi] = useState<CarouselApi>();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActiveIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    api.on("reInit", onSelect);
    return () => {
      api.off("select", onSelect);
      api.off("reInit", onSelect);
    };
  }, [api]);

  // The selected variant's image leads the gallery, so jump back to it.
  useEffect(() => {
    setActiveIndex(0);
    api?.scrollTo(0, true);
  }, [api, primaryImageUrl]);

  return (
    <div data-testid="product-gallery" className="min-w-0">
      <Carousel
        setApi={setApi}
        // From md up the slides sit in a two-column grid instead of a slider.
        opts={{ breakpoints: { "(min-width: 768px)": { active: false } } }}
        aria-label={product.title}
      >
        <CarouselContent
          data-product-gallery-track
          className="md:ml-0 md:grid md:grid-cols-2"
        >
          {images.map((image, index) => (
            <CarouselItem
              key={image.url}
              aria-label={`Slide ${index + 1} of ${images.length}`}
              className="[contain:paint] md:pl-0"
            >
              <div className="bg-muted aspect-square overflow-hidden">
                <img
                  src={image.url}
                  alt={image.altText ?? product.title}
                  width={image.width ?? undefined}
                  height={image.height ?? undefined}
                  className="h-full w-full object-cover"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  data-testid={
                    index === 0 ? "product-gallery-image" : undefined
                  }
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 ? (
          <>
            <CarouselPrevious
              size="icon-lg"
              className="left-2 size-11 md:hidden"
            />
            <CarouselNext
              size="icon-lg"
              className="right-2 size-11 md:hidden"
            />
            <div className="absolute inset-x-0 bottom-4 z-10 flex items-center justify-center gap-3 md:hidden">
              <div
                data-slideshow-dots
                role="group"
                aria-label="Slideshow pagination"
                className="flex items-center justify-center gap-2"
              >
                {images.map((image, index) => (
                  <span
                    key={image.url}
                    className={galleryDotClass(index === activeIndex)}
                  />
                ))}
              </div>
            </div>
          </>
        ) : null}
      </Carousel>
    </div>
  );
}

function PriceBlock({
  product,
  selectedVariant,
}: {
  product: ProductData;
  selectedVariant: ProductVariant | null;
}) {
  const price = selectedVariant?.price ?? product.priceRange.minVariantPrice;
  const compareAt = selectedVariant?.compareAtPrice;
  const percent = salePercent(price, compareAt);

  return (
    <div className="mt-4" data-product-price>
      <div className="inline-flex flex-wrap items-center gap-2">
        {compareAt && percent ? (
          <>
            <span className="text-destructive font-medium">
              <span className="sr-only">Sale price: </span>
              {formatPrice(price)}
            </span>
            <s className="text-muted-foreground text-sm line-through">
              <span className="sr-only">Regular price: </span>
              {formatPrice(compareAt)}
            </s>
            <Badge variant="destructive" aria-label={`Save ${percent}%`}>
              -{percent}%
            </Badge>
          </>
        ) : (
          <span className="font-medium">
            <span className="sr-only">Price: </span>
            {formatPrice(price)}
          </span>
        )}
      </div>
    </div>
  );
}

function InventoryHint({
  selectedVariant,
}: {
  selectedVariant: ProductVariant | null;
}) {
  // Only sold-out is shown. Low-stock counts ("Only 3 left") are left out on
  // purpose: the stores carry no stock warnings (see AGENTS.md, "Content rules").
  if (!selectedVariant || selectedVariant.availableForSale) return null;

  return (
    <div className="mt-3" data-product-inventory>
      <Badge variant="destructive">Out of stock</Badge>
    </div>
  );
}

// Mirrors React Router's own Link guard: a modified or non-primary click belongs to
// the browser (new tab, new window), so the href must stay in charge of it.
function isPlainActivation(event: MouseEvent<HTMLAnchorElement>) {
  return (
    !event.defaultPrevented &&
    event.button === 0 &&
    !event.metaKey &&
    !event.altKey &&
    !event.ctrlKey &&
    !event.shiftKey &&
    (!event.currentTarget.target || event.currentTarget.target === "_self")
  );
}

function VariantOptions({ product }: { product: ProductData }) {
  const { options, register } = useProductForm();
  const swatches = useMemo(() => buildSwatchLookup(product), [product]);
  const location = useLocation();
  const baseParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search],
  );

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => {
        const selectedValue = option.values.find(
          (value) => value.selected,
        )?.name;
        const renderSwatches = hasSwatchData(product, option.name);
        const isColorOption = option.name.toLowerCase().includes("color");

        return (
          <FieldSet key={option.name} className="gap-2">
            <FieldLegend variant="label" className="mb-2">
              {option.name}
              {selectedValue ? `: ${selectedValue}` : ""}
            </FieldLegend>
            <div
              className="flex flex-wrap gap-2"
              role="group"
              aria-label={option.name}
            >
              {option.values.map((variantOption) => {
                const valueName = variantOption.name;
                const registered = register("optionValue", {
                  optionName: option.name,
                  value: valueName,
                });
                const isCrossProduct = variantOption.handle !== product.handle;
                const linkTarget = variantUrl(
                  product,
                  variantOption.selectedOptions,
                  variantOption.handle,
                  baseParams,
                );
                const soldOut = !variantOption.available;
                const testId = isColorOption ? "color-swatch" : undefined;
                const swatch = renderSwatches
                  ? swatches.get(`${option.name}:${valueName}`)
                  : null;
                const swatchColor = swatch?.imageUrl
                  ? undefined
                  : (swatch?.color ?? undefined);

                // Swatches are round ghost buttons; pills fill in when selected.
                const variant = renderSwatches
                  ? "ghost"
                  : variantOption.selected
                    ? "default"
                    : "outline";
                const size = renderSwatches ? "icon" : "default";
                const className = renderSwatches
                  ? cn("size-11 rounded-full", soldOut && "opacity-50")
                  : cn(
                      "h-auto min-h-11 min-w-11 px-3 py-1.5",
                      soldOut && "opacity-50",
                    );
                const content = renderSwatches ? (
                  <>
                    <span
                      className={cn(
                        "relative inline-flex size-8 items-center justify-center overflow-hidden rounded-full border",
                        variantOption.selected &&
                          "ring-ring ring-offset-background ring-2 ring-offset-2",
                      )}
                      style={{ backgroundColor: swatchColor }}
                    >
                      {swatch?.imageUrl ? (
                        <img
                          src={swatch.imageUrl}
                          alt=""
                          className="size-full object-cover"
                        />
                      ) : null}
                      {soldOut ? (
                        <SlashIcon
                          className="absolute inset-0 size-full"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      ) : null}
                    </span>
                    <span className="sr-only">
                      {valueName}
                      {soldOut ? " (Sold out)" : ""}
                    </span>
                  </>
                ) : (
                  `${valueName}${soldOut ? " (Sold out)" : ""}`
                );

                if (!isCrossProduct && !variantOption.exists) {
                  return (
                    <Button
                      key={valueName}
                      type="button"
                      variant={variant}
                      size={size}
                      disabled
                      className={className}
                      aria-label={renderSwatches ? valueName : undefined}
                      aria-pressed={variantOption.selected}
                      data-testid={testId}
                    >
                      {content}
                    </Button>
                  );
                }

                // Every selectable value is an <a> whichever product it belongs to. The
                // activated value flips from cross-product to same-product after the
                // navigation, and a change of element type there would remount the
                // focused control and drop focus to <body>.
                return (
                  <Button
                    key={valueName}
                    asChild
                    variant={variant}
                    size={size}
                    className={className}
                  >
                    <Link
                      to={toRouterLocation(linkTarget)}
                      replace={!isCrossProduct}
                      preventScrollReset
                      aria-label={renderSwatches ? valueName : undefined}
                      aria-current={variantOption.selected ? "true" : undefined}
                      data-testid={testId}
                      onClick={
                        isCrossProduct
                          ? undefined
                          : (event) => {
                              if (!isPlainActivation(event)) return;
                              registered.onClick();
                              // onSelect has already navigated with the provider's replace
                              // and revalidation settings. Letting Link navigate too would
                              // refetch the loader that a resolved selection just skipped.
                              event.preventDefault();
                            }
                      }
                    >
                      {content}
                    </Link>
                  </Button>
                );
              })}
            </div>
          </FieldSet>
        );
      })}
    </div>
  );
}

function QuantitySelector({
  quantity,
  setQuantity,
}: {
  quantity: number;
  setQuantity: (quantity: number) => void;
}) {
  const { register } = useProductForm();
  const clamp = (value: number) => Math.min(99, Math.max(1, value));

  return (
    <div className="flex shrink-0 flex-col gap-2">
      <Label htmlFor="quantity">Quantity</Label>
      <ButtonGroup data-testid="quantity-stepper">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11"
          aria-label="Decrease quantity"
          onClick={() => setQuantity(clamp(quantity - 1))}
          disabled={quantity <= 1}
        >
          <MinusIcon aria-hidden="true" />
        </Button>
        <Input
          type="number"
          id="quantity"
          {...register("quantity", { value: quantity })}
          min={1}
          max={99}
          step={1}
          className="h-11 w-12 [appearance:textfield] text-center [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
          aria-label="Quantity"
          onChange={(event) =>
            setQuantity(
              clamp(Number.parseInt(event.currentTarget.value, 10) || 1),
            )
          }
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-11"
          aria-label="Increase quantity"
          onClick={() => setQuantity(clamp(quantity + 1))}
          disabled={quantity >= 99}
        >
          <PlusIcon aria-hidden="true" />
        </Button>
      </ButtonGroup>
    </div>
  );
}

function AddToCart({
  product,
  quantity,
  setQuantity,
  selectedVariant,
}: {
  product: ProductData;
  quantity: number;
  setQuantity: (quantity: number) => void;
  selectedVariant: ProductVariant | null;
}) {
  const { options, register, formProps, errors, pending } = useProductForm();
  const addable = canAddToCart(product, options);
  const buttonText = addable
    ? "Add to cart"
    : selectedVariant
      ? "Sold out"
      : "Select options";

  return (
    <>
      <form {...formProps({ afterSubmit: openCartDrawer })}>
        <div className="mt-6 mb-10 flex items-center gap-4">
          <QuantitySelector quantity={quantity} setQuantity={setQuantity} />
        </div>
        <input type="hidden" {...register("merchandiseId", {})} />
        <Button
          {...register("addToCart", {})}
          size="lg"
          className="h-11 w-full"
          disabled={!addable || pending}
          data-testid="add-to-cart"
        >
          {buttonText}
        </Button>
      </form>
      {selectedVariant ? (
        <div className="mt-3">
          <ShopPayButton
            variants={[{ id: selectedVariant.id, quantity }]}
            disabled={!addable || pending}
            width="100%"
            borderRadius="8px"
          />
        </div>
      ) : null}
      {[...errors.userErrors, ...errors.warnings, ...errors.networkErrors]
        .length ? (
        <div className="mt-3 grid gap-1 text-sm" role="alert">
          {errors.userErrors.map((error) => (
            <p key={error.message} className="text-destructive">
              {error.message}
            </p>
          ))}
          {errors.warnings.map((warning) => (
            <p key={warning.message} className="text-muted-foreground">
              {warning.message}
            </p>
          ))}
          {errors.networkErrors.map((error) => (
            <p key={error.message} className="text-destructive">
              {error.message}
            </p>
          ))}
        </div>
      ) : null}
    </>
  );
}

function ProductInfo({
  product,
  selectedVariant,
}: {
  product: ProductData;
  selectedVariant: ProductVariant | null;
}) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="flex flex-col gap-6 md:sticky md:top-8 md:self-start">
      <div className="pt-4 md:pt-8">
        {product.vendor ? (
          <p className="text-muted-foreground mb-4 text-sm tracking-wide uppercase">
            {product.vendor}
          </p>
        ) : null}
        <h1 className="font-heading text-4xl font-semibold tracking-tight md:text-5xl">
          {product.title}
        </h1>
        <PriceBlock product={product} selectedVariant={selectedVariant} />
        <InventoryHint selectedVariant={selectedVariant} />
      </div>

      <span className="sr-only" aria-live="polite" id="inventory-status" />

      {product.description ? (
        <div className="text-muted-foreground text-sm leading-relaxed">
          {product.description}
        </div>
      ) : null}

      <div data-product-form>
        <span className="sr-only" aria-live="polite" data-add-to-cart-status />
        <VariantOptions product={product} />
        <AddToCart
          product={product}
          quantity={quantity}
          setQuantity={setQuantity}
          selectedVariant={selectedVariant}
        />
      </div>

      <h2 className="sr-only">Product details</h2>
      <Accordion
        type="single"
        collapsible
        defaultValue="description"
        className="border-y"
      >
        <AccordionItem value="description">
          <AccordionTrigger className="px-1">Description</AccordionTrigger>
          <AccordionContent className="text-muted-foreground px-1 leading-relaxed [&_ol]:mb-4 [&_ol]:list-decimal [&_ol]:ps-6 [&_ul]:mb-4 [&_ul]:list-disc [&_ul]:ps-6">
            {product.descriptionHtml ? (
              <div
                dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
              />
            ) : (
              <p>{product.description}</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}

function ProductPageContent({ product }: { product: ProductData }) {
  const { selectedVariant } = useProductForm();

  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-4">
      <div className="mb-16 grid grid-cols-1 gap-6 md:grid-cols-[2fr_1fr] md:gap-12">
        <ProductGallery product={product} selectedVariant={selectedVariant} />
        <ProductInfo product={product} selectedVariant={selectedVariant} />
      </div>
    </section>
  );
}

function RelatedProducts({ products }: { products: RelatedProduct[] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-4" aria-labelledby="related-products-heading">
      <div className="border-t pt-12">
        <h2
          id="related-products-heading"
          className="font-heading mx-auto mb-8 max-w-7xl px-4 text-3xl font-semibold tracking-tight"
        >
          More products
        </h2>
        <div className="mx-auto max-w-7xl px-4 [contain:paint]">
          <ul
            role="list"
            className="grid grid-cols-1 gap-x-1 gap-y-10 md:grid-cols-2 lg:grid-cols-4"
          >
            {products.map((product) => (
              <li key={product.handle}>
                <ProductCard product={product} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function ProductRoute({ loaderData }: Route.ComponentProps) {
  const { product, relatedProducts } = loaderData;
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <ProductProvider
      product={product}
      onSelect={(result) => {
        const url = toRouterLocation(
          variantUrl(
            product,
            result.selectedOptions,
            result.selectedVariant?.product?.handle,
            new URLSearchParams(location.search),
          ),
        );
        void navigate(url, {
          replace: true,
          preventScrollReset: true,
          ...(result.status === "resolved"
            ? { defaultShouldRevalidate: false }
            : {}),
        });
      }}
    >
      <ProductViewedTracker product={product} />
      <main className="flex-1" id="main-content" tabIndex={-1}>
        <ProductPageContent product={product} />
        <RelatedProducts products={relatedProducts} />
      </main>
    </ProductProvider>
  );
}
