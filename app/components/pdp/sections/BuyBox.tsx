import { ArrowRightIcon } from "lucide-react";
import { useEffect, useId, useState, type FormEvent } from "react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { SwatchFill } from "~/components/brand/SwatchFill";
import { Stars } from "~/components/proof/Rating";
import { SizeGuideButton } from "~/components/store/SizeGuide";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { brand } from "~/content/brand";
import {
  getColour,
  sizes as catalogSizes,
  type ColourId,
  type SizeId,
} from "~/content/catalog";
import { gifts, money, pricing } from "~/content/offers";
import { getReview } from "~/content/reviews";
import type { Bundle } from "~/content/types";
import { BUNDLE_ATTRIBUTE, OFFER_ATTRIBUTE } from "~/lib/bundle-cart";
import { useCartForm } from "~/lib/cart";
import { useOffer } from "~/lib/offer";
import { cn } from "~/lib/utils";

import { CtaNote } from "../blocks/CtaNote";
import { FIT_STEP_ID, useSelection } from "../selection";

/** SOP section 2: numbered step, every bundle visible, no dropdowns. */
export function BuyBox() {
  const { offer, bundle: selected, setBundleId } = useSelection();
  const headingId = useId();

  return (
    <section
      data-sop-section="buy-box"
      aria-label="Choose your bundle"
      id="buy"
      className="scroll-mt-20"
    >
      <h2
        id={headingId}
        className="font-heading mb-4 text-lg font-bold uppercase"
      >
        {brand.pdp.stepHeading}
      </h2>
      {/* Radix renders a native radio per item (name="bundle-rally") in the
          server HTML, so the content check can count the three bundles. */}
      <RadioGroup
        name={`bundle-${brand.id}`}
        value={selected.id}
        onValueChange={(value) => {
          const bundle = offer.bundles.find((b) => b.id === value);
          if (bundle) setBundleId(bundle.id);
        }}
        aria-labelledby={headingId}
        className="border-foreground grid-cols-3 gap-0 border-2"
      >
        {offer.bundles.map((bundle) => (
          <BundleOption
            key={bundle.id}
            bundle={bundle}
            selected={bundle.id === selected.id}
          />
        ))}
      </RadioGroup>
      <FitStep />
      <div className="mt-3 flex justify-end">
        <PlaceholderTag
          kind="illustrative"
          label="Illustrative bundles and prices"
        />
      </div>
      <MainCta />
      <CtaNote />
    </section>
  );
}

/** A bundle as a column of Rally's spec sheet; the whole column is the radio's label. */
function BundleOption({
  bundle,
  selected,
}: {
  bundle: Bundle;
  selected: boolean;
}) {
  const { allColours } = useSelection();
  const id = useId();
  const p = pricing(bundle);
  const names = brand.bundleNames[bundle.id];

  return (
    <Label
      htmlFor={id}
      className={cn(
        "border-foreground has-focus-visible:ring-ring relative flex h-full cursor-pointer flex-col items-stretch gap-0 text-sm leading-normal font-normal transition not-last:border-e-2 has-focus-visible:ring-2 has-focus-visible:ring-inset motion-reduce:transition-none",
        selected
          ? "bg-primary text-primary-foreground"
          : "bg-card text-card-foreground hover:bg-muted",
      )}
    >
      {/* Visually hidden: the column shows the state. */}
      <RadioGroupItem
        id={id}
        value={bundle.id}
        className="sr-only absolute top-0 left-0"
      />
      <span
        className={cn(
          scoreLabel,
          "border-foreground flex items-center justify-between gap-1 border-b-2 px-2 py-1.5 text-[11px]",
        )}
      >
        <span className="min-w-0 truncate">{bundle.badge ?? "Standard"}</span>
        <span
          aria-hidden
          className={cn(
            "size-3 shrink-0 border-2 border-current",
            selected && "bg-foreground",
          )}
        />
      </span>
      <span className="flex justify-center border-b border-current/25 px-2 py-3">
        <SleeveStack
          count={bundle.quantity}
          colours={allColours}
          className="h-10 sm:h-12"
        />
      </span>
      <SpecRow label="Qty" value={names.title} strong />
      <SpecRow label="Total" value={money(p.total)} strong />
      <SpecRow label="Was" value={money(p.compareAt)} strike />
      <SpecRow label="Save" value={money(p.saving)} />
      <SpecRow label="Unit" value={money(p.perUnit)} />
      <span className="flex min-h-12 items-center justify-center px-2 py-2">
        <GiftThumbs bundle={bundle} />
      </span>
    </Label>
  );
}

function SpecRow({
  label,
  value,
  strong,
  strike,
}: {
  label: string;
  value: string;
  strong?: boolean;
  strike?: boolean;
}) {
  return (
    <span className="flex flex-wrap items-baseline justify-between gap-x-1 border-b border-current/25 px-2 py-1.5">
      <span className={cn(scoreLabel, "text-[10px] opacity-70")}>{label}</span>
      <span
        className={cn(
          "tabular-nums",
          strong && "font-heading text-base font-bold sm:text-lg",
          strike && "line-through opacity-70",
        )}
      >
        {value}
      </span>
    </span>
  );
}

/** The bundle's sleeves, fanned out, in the colours picked so far. */
export function SleeveStack({
  count,
  colours = [],
  className,
}: {
  count: number;
  /** Colour per sleeve; missing slots show black. */
  colours?: ColourId[];
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn("relative flex items-end justify-center", className)}
    >
      {Array.from({ length: count }, (_, i) => (
        <Img
          key={i}
          image={getColour(colours[i] ?? "black").thumb}
          sizes="96px"
          alt=""
          className={cn(
            "aspect-square h-full w-auto object-contain mix-blend-multiply",
            // Fixed overlaps: a percentage would be of the container, not the image.
            i > 0 && (count > 2 ? "-ms-[1.6rem]" : "-ms-[1.1rem]"),
            count > 1 && i === 0 && "-rotate-6",
            count > 2 && i === count - 1 && "rotate-6",
          )}
        />
      ))}
    </span>
  );
}

function GiftThumbs({
  bundle,
  className,
}: {
  bundle: Bundle;
  className?: string;
}) {
  if (!bundle.gifts.length) {
    return (
      <span className={cn("text-[10px] text-current/60", className)}>
        No gifts
      </span>
    );
  }
  return (
    <span className={cn("flex flex-wrap items-center gap-1", className)}>
      {bundle.gifts.map((id) => (
        <span
          key={id}
          className="flex items-center gap-1"
          title={`Free ${gifts[id].name}`}
        >
          <Img
            image={gifts[id].image}
            sizes="32px"
            alt={gifts[id].name}
            className="bg-card size-7 border border-current/20 object-contain"
          />
        </span>
      ))}
      <span className="text-[10px] font-bold uppercase">+ free</span>
    </span>
  );
}

/** True once React has hydrated; false in the server HTML. */
function useHydrated() {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);
  return hydrated;
}

/**
 * The main add-to-cart button. Once the cart store is ready, the selection adds
 * one line per chosen colour and size and opens the cart; with a size missing it
 * points at the fit step instead. Until then (or with JavaScript off) the form
 * posts natively to Hydrogen's cart route: the bundle's quantity of the first
 * sleeve's variant, tagged with the bundle. With no size there's nothing safe to
 * post, so the server-rendered button stays disabled.
 */
function MainCta() {
  const {
    ctaRef,
    price,
    bundle,
    offerId,
    colours,
    sizes,
    sizeVariant,
    missingSize,
    canAdd,
    adding,
    addToCart,
  } = useSelection();
  const { copy } = useOffer();
  const { formProps, register } = useCartForm();
  const hydrated = useHydrated();
  const firstVariant = colours[0]
    ? sizeVariant(colours[0], sizes[0] ?? null)?.variantId
    : undefined;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    const form = event.currentTarget;
    // A re-submit from below: let the browser post the plain form.
    if (form.dataset.plainPost) return;
    // This handler only runs once React has hydrated, so add the whole bundle
    // (a line per colour and size). If the cart store never connects, fall back
    // to the plain post, which adds the bundle in the first sleeve's variant.
    event.preventDefault();
    const submitter = (event.nativeEvent as globalThis.SubmitEvent).submitter;
    addToCart()
      .then((added) => {
        if (added) return;
        form.dataset.plainPost = "true";
        form.requestSubmit(submitter);
      })
      // Failures land in the cart state's errors, as with Hydrogen's own forms.
      .catch(() => {});
  }

  const label = !canAdd
    ? "Unavailable"
    : missingSize
      ? "Choose a size"
      : copy.cta;

  return (
    // formProps() supplies the cart route and method; our onSubmit replaces
    // its handler so the hydrated path adds the whole bundle.
    <form {...formProps()} onSubmit={handleSubmit} className="mt-4">
      <input
        type="hidden"
        {...register("merchandiseId", { value: firstVariant ?? "" })}
      />
      <input
        type="hidden"
        {...register("quantity", { value: bundle.quantity })}
      />
      <input
        type="hidden"
        {...register("attributeValue", {
          key: BUNDLE_ATTRIBUTE,
          value: bundle.id,
        })}
      />
      <input
        type="hidden"
        {...register("attributeValue", {
          key: OFFER_ATTRIBUTE,
          value: offerId,
        })}
      />
      <Button
        ref={ctaRef}
        {...register("add")}
        type="submit"
        size="lg"
        disabled={!canAdd || adding || (!hydrated && !firstVariant)}
        aria-busy={adding}
        data-testid="add-to-cart"
        className="border-foreground font-heading hover:bg-secondary hover:text-primary h-auto min-h-14 w-full justify-between gap-3 rounded-none border-2 px-6 py-4 text-lg font-extrabold whitespace-normal uppercase"
      >
        <span className="text-start">{label}</span>
        {canAdd && (
          <span className="flex shrink-0 items-center gap-2 tabular-nums">
            {money(price.total)}
            <ArrowRightIcon aria-hidden className="size-5" />
          </span>
        )}
      </Button>
    </form>
  );
}

/** Step 2: a size and colour for every sleeve in the bundle, with a preview photo. */
function FitStep() {
  const {
    bundle,
    colours,
    sizes,
    previewColour,
    setColour,
    setSize,
    showSizeHint,
    missingSize,
  } = useSelection();
  const headingId = useId();
  const many = bundle.quantity > 1;

  return (
    <div
      role="group"
      aria-labelledby={headingId}
      id={FIT_STEP_ID}
      className="mt-6 scroll-mt-24"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-x-4">
        <h2
          id={headingId}
          className="font-heading text-xl font-extrabold uppercase italic"
        >
          {brand.pdp.fitStep}
        </h2>
        <SizeGuideButton />
      </div>
      <div className="border-foreground bg-card text-card-foreground grid grid-cols-[6.5rem_1fr] items-start gap-4 border-2 p-3 sm:grid-cols-[8rem_1fr]">
        <Img
          key={previewColour}
          image={getColour(previewColour).studio}
          sizes="8rem"
          alt={`${brand.productName}, ${brand.store.colourNames[previewColour]}`}
          className="bg-muted motion-safe:animate-colour-in aspect-square w-full object-cover"
        />
        <div className="min-w-0 space-y-4">
          {colours.map((colour, i) => (
            <div key={i} className={cn("space-y-2", i > 0 && "border-t pt-3")}>
              {many && (
                <p className={cn(scoreLabel, "text-muted-foreground text-xs")}>
                  Sleeve {i + 1}
                </p>
              )}
              <SizeChips
                slot={i}
                value={sizes[i] ?? null}
                onChange={(next) => setSize(i, next)}
                size={many ? "sm" : "md"}
              />
              <SleeveSwatches
                slot={i}
                value={colour}
                onChange={(next) => setColour(i, next)}
              />
            </div>
          ))}
        </div>
      </div>
      {showSizeHint && missingSize && (
        <p role="alert" className="text-highlight mt-2 text-sm font-semibold">
          Choose a size for {many ? "each sleeve" : "your sleeve"} to add it to
          your cart.
        </p>
      )}
      {/* Without JavaScript the chips above can't be pressed: these links
          reload the page with every sleeve in that size, so the plain form can post. */}
      <noscript>
        <p className="mt-2 flex flex-wrap items-center gap-2 text-sm">
          Pick a size:
          {catalogSizes.map((size) => (
            <a
              key={size.id}
              href={`?size=${size.id}#${FIT_STEP_ID}`}
              className="font-semibold underline underline-offset-4"
            >
              {size.id}
            </a>
          ))}
        </p>
      </noscript>
      <div className="mt-2 flex justify-end">
        <PlaceholderTag
          kind="illustrative"
          label="Sizes and colours to be confirmed with the supplier"
        />
      </div>
    </div>
  );
}

/** Size buttons S–XL for one sleeve. No default: a wrong size is the likeliest return. */
function SizeChips({
  slot,
  value,
  onChange,
  size,
}: {
  slot: number;
  value: SizeId | null;
  onChange: (size: SizeId) => void;
  size: "sm" | "md";
}) {
  const { colours, sizeVariant, bundle } = useSelection();
  const colour = colours[slot]!;

  return (
    <ToggleGroup
      type="single"
      value={value ?? ""}
      onValueChange={(next) => {
        const match = catalogSizes.find((s) => s.id === next);
        if (match) onChange(match.id);
      }}
      aria-label={
        bundle.quantity > 1 ? `Sleeve ${slot + 1} size` : "Sleeve size"
      }
      data-size-step
      spacing={1.5}
      className="flex-wrap"
    >
      {catalogSizes.map((s) => (
        <ToggleGroupItem
          key={s.id}
          value={s.id}
          disabled={!sizeVariant(colour, s.id)?.available}
          title={`${s.shoe} · ankle ${s.ankle}`}
          className={cn(
            scoreLabel,
            "border-foreground/25 bg-card hover:border-foreground data-[state=on]:border-foreground data-[state=on]:bg-foreground data-[state=on]:text-background rounded-none border",
            size === "sm" ? "h-9 min-w-11 px-2 text-xs" : "h-11 min-w-12 px-3",
          )}
        >
          {s.id}
          <span className="sr-only">
            {" "}
            ({s.shoe}, ankle {s.ankle})
          </span>
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}

/** One sleeve's colour: the colourways the Shopify product sells, sold-out ones disabled. */
function SleeveSwatches({
  slot,
  value,
  onChange,
}: {
  slot: number;
  value: ColourId;
  onChange: (colour: ColourId) => void;
}) {
  const { hero, bundle } = useSelection();

  return (
    <div className="flex flex-wrap items-center gap-1">
      <ToggleGroup
        type="single"
        value={value}
        onValueChange={(next) => {
          const colour = hero.colours.find((c) => c.id === next);
          if (colour) onChange(colour.id);
        }}
        aria-label={
          bundle.quantity > 1 ? `Sleeve ${slot + 1} colour` : "Sleeve colour"
        }
        spacing={0.5}
        className="flex-wrap"
      >
        {hero.colours.map((colour) => (
          <ToggleGroupItem
            key={colour.id}
            value={colour.id}
            disabled={!colour.available}
            aria-label={colour.name}
            title={colour.name}
            className="relative size-11 rounded-none p-0 hover:bg-transparent data-[state=on]:bg-transparent"
          >
            <SwatchFill
              colour={colour.swatch}
              className="group-data-[state=on]/toggle:ring-foreground group-data-[state=on]/toggle:ring-offset-card size-7 group-data-[state=on]/toggle:ring-2 group-data-[state=on]/toggle:ring-offset-2"
            />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <span className="ms-1 text-sm font-medium">
        {brand.store.colourNames[value]}
      </span>
    </div>
  );
}

/** One short placeholder review, shown under the button. */
export function ShortReview() {
  const review = getReview(brand.pdp.underButtonReview);

  return (
    <figure className="border-primary bg-card flex gap-3 border-l-4 p-4 text-sm">
      <div className="min-w-0 space-y-1.5">
        <div className="flex flex-wrap items-center gap-2">
          <Stars rating={review.rating} className="size-3.5" />
          <span className="font-semibold">{review.name}</span>
          <PlaceholderTag kind="review-placeholder" />
        </div>
        <p className="font-semibold">{review.title}</p>
        <blockquote>“{review.body}”</blockquote>
        <figcaption className="text-muted-foreground text-xs">
          {review.source}
        </figcaption>
      </div>
    </figure>
  );
}
