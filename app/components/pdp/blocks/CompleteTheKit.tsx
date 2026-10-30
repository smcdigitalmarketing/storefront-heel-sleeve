import { CheckIcon, PlusIcon } from "lucide-react";
import { useEffect, useId, useState } from "react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import { scoreLabel } from "~/components/brand/score-label";
import { Button } from "~/components/ui/button";
import { brand } from "~/content/brand";
import { MAIN_PRODUCT, getProduct, type ProductId } from "~/content/catalog";
import { money } from "~/content/offers";
import { proof } from "~/content/proof";
import { addLinesToCart, canUpdateCart } from "~/lib/bundle-cart";
import { useCart } from "~/lib/cart";
import { cn } from "~/lib/utils";

/** Shopify variant ids for the accessories, by catalog id. */
export type KitVariantIds = Partial<Record<ProductId, string>>;

/**
 * Accessories that go with the main product, each with a quick add. The
 * accessories aren't Shopify products yet (mock.shop has none), so until a
 * store is linked and `variantIds` is passed, each "Add" stays disabled and
 * says so.
 */
export function CompleteTheKit({
  variantIds = {},
}: {
  variantIds?: KitVariantIds;
}) {
  const items = getProduct(MAIN_PRODUCT)
    .related.map(getProduct)
    .filter((p) => !p.amounts && p.images.length);

  return (
    <div
      data-block="kit"
      className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow="Add-ons">
          {brand.pdp.kitHeadline}
        </SectionHeading>
        <PlaceholderTag kind="illustrative" />
      </div>
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const { name, blurb } = brand.store.products[item.id];
          return (
            <li
              key={item.id}
              className="flex items-center gap-4 border-2 border-foreground bg-card p-3 text-card-foreground"
            >
              <Img
                image={item.images[0]}
                sizes="96px"
                alt=""
                className="size-20 shrink-0 object-cover sm:size-24"
              />
              <div className="min-w-0 flex-1 space-y-1">
                <p className={cn(scoreLabel, "leading-tight")}>{name}</p>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {blurb}
                </p>
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="font-semibold tabular-nums">
                    {money(item.price)}
                  </span>
                  <KitAdd name={name} variantId={variantIds[item.id]} />
                </div>
              </div>
            </li>
          );
        })}
      </ul>
      <p className="mt-4 text-sm text-muted-foreground">
        Free shipping on orders over ${proof.shipping.freeOver}.
      </p>
    </div>
  );
}

/** Rally's quick add: a square Night chip with a lime scoreboard label. */
const ADD_CLASS = cn(scoreLabel, "h-11 rounded-none px-4 text-primary");

/**
 * The quick add. With a variant id it adds one to the cart through Shopify's
 * Standard Actions and confirms in place (the cart stays closed, as in the
 * mock); without one it's disabled and labelled.
 */
function KitAdd({ name, variantId }: { name: string; variantId?: string }) {
  const tagId = useId();
  const cartId = useCart((state) => state.data.id);
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 2000);
    return () => clearTimeout(timer);
  }, [added]);

  if (!variantId) {
    return (
      <>
        <Button
          variant="secondary"
          disabled
          aria-label={`Add ${name} to cart`}
          aria-describedby={tagId}
          className={ADD_CLASS}
        >
          <PlusIcon aria-hidden />
          Add
        </Button>
        <span id={tagId} className="basis-full">
          <PlaceholderTag kind="tbc" label="Added when the store is linked" />
        </span>
      </>
    );
  }

  async function add() {
    if (!variantId || !canUpdateCart()) return;
    setAdding(true);
    try {
      await addLinesToCart([{ merchandiseId: variantId, quantity: 1 }], {
        hasCart: Boolean(cartId),
      });
      setAdded(true);
    } finally {
      setAdding(false);
    }
  }

  return (
    <>
      <Button
        variant="secondary"
        onClick={add}
        disabled={adding}
        aria-label={`Add ${name} to cart`}
        className={ADD_CLASS}
      >
        {added ? <CheckIcon aria-hidden /> : <PlusIcon aria-hidden />}
        {added ? "Added" : "Add"}
      </Button>
      <span className="sr-only" aria-live="polite">
        {added ? `${name} added to cart` : ""}
      </span>
    </>
  );
}
