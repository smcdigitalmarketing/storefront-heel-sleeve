import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { Gallery } from "~/components/gallery/Gallery";
import { RatingBadge } from "~/components/proof/Rating";
import { TrustRow } from "~/components/proof/TrustRow";
import { Badge } from "~/components/ui/badge";
import { brand } from "~/content/brand";
import { money } from "~/content/offers";
import { fillProof } from "~/content/proof";
import { useOffer } from "~/lib/offer";
import { cn } from "~/lib/utils";

import { featureIcons } from "../icons";
import { useSelection } from "../selection";
import { BuyBox } from "./BuyBox";
import { UnderButton } from "./UnderButton";

/**
 * SOP sections 1–3 in Flashpop's "gallery-left" hero. They share one grid so
 * the buy box sits beside the gallery on desktop, but stay in SOP order in the
 * DOM and on mobile.
 */
export function HeroSections() {
  return (
    <div
      id="top"
      className="mx-auto grid max-w-7xl scroll-mt-20 grid-cols-1 gap-x-10 gap-y-6 px-4 pt-5 pb-12 sm:px-6 lg:grid-cols-2 lg:grid-rows-[auto_auto_1fr] lg:gap-x-14 lg:pt-10"
    >
      <section
        data-sop-section="above-the-fold"
        aria-label="Product overview"
        className="contents"
      >
        <div className="lg:col-start-1 lg:row-span-3 lg:row-start-1">
          {/* top-22 clears the 4rem sticky header. */}
          <div className="lg:sticky lg:top-22">
            <Gallery />
          </div>
        </div>
        <div className="space-y-5 lg:col-start-2 lg:row-start-1">
          <TitleBlock />
          <PriceAndBullets />
        </div>
      </section>
      <div className="lg:col-start-2 lg:row-start-2">
        <BuyBox />
      </div>
      <div className="lg:col-start-2 lg:row-start-3">
        <UnderButton />
      </div>
    </div>
  );
}

function TitleBlock() {
  const { copy } = useOffer();

  return (
    <div className="space-y-3">
      {copy.headline && (
        <p className="bg-foreground font-heading text-secondary inline-flex -rotate-1 items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold">
          {copy.headline}
        </p>
      )}
      <ProofLine />
      <h1 className="font-heading text-4xl leading-[0.95] font-extrabold tracking-[-0.03em] text-balance sm:text-5xl">
        <span className="text-primary block">{brand.productName}:</span>{" "}
        <span>{capitalise(brand.pdp.titleBenefit)}</span>
      </h1>
      <p className="text-muted-foreground text-base sm:text-lg">
        {brand.pdp.subheadline}
      </p>
    </div>
  );
}

function capitalise(text: string) {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * SOP: social proof line above the title. The rating and customer count are
 * illustrative until verified reviews exist, and labelled as such.
 */
function ProofLine() {
  return (
    <div className="flex flex-col gap-1.5">
      <RatingBadge />
      <p
        data-proof="customers"
        className="text-muted-foreground flex flex-wrap items-center gap-2 text-sm"
      >
        {fillProof(brand.pdp.proofLine)}
        <PlaceholderTag kind="illustrative" label="Illustrative count" />
      </p>
    </div>
  );
}

/** Icon chip colours, in turn. */
const BULLET_TONES = [
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-highlight text-highlight-foreground",
  "bg-primary text-primary-foreground",
];

function PriceAndBullets() {
  const { price, bundle } = useSelection();
  const bundleName = brand.bundleNames[bundle.id].title;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <span className="font-heading text-3xl font-extrabold tabular-nums">
          {money(price.total)}
        </span>
        <s className="text-muted-foreground text-lg tabular-nums">
          {money(price.compareAt)}
        </s>
        <Badge
          variant="secondary"
          className="h-auto px-3 py-1 text-sm font-semibold"
        >
          You save {money(price.saving)}
        </Badge>
        <span className="text-muted-foreground w-full text-sm">
          {bundleName} · {money(price.perUnit)} per sleeve
          {price.giftValue > 0 &&
            ` · ${money(price.giftValue)} of gifts included`}
        </span>
        <PlaceholderTag kind="illustrative" />
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {brand.pdp.bullets.map((bullet, i) => {
          const Icon = featureIcons[bullet.icon];
          return (
            <li
              key={bullet.text}
              className="flex items-start gap-3 text-[0.95rem] leading-snug"
            >
              <span
                aria-hidden="true"
                className={cn(
                  "flex size-9 shrink-0 items-center justify-center rounded-full",
                  BULLET_TONES[i % BULLET_TONES.length],
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="pt-1.5">{bullet.text}</span>
            </li>
          );
        })}
      </ul>
      <TrustRow variant="strip" count={3} />
    </div>
  );
}
