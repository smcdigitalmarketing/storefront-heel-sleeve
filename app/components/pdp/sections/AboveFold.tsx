import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { Gallery } from "~/components/gallery/Gallery";
import { RatingBadge } from "~/components/proof/Rating";
import { TrustRow } from "~/components/proof/TrustRow";
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
 * SOP sections 1–3 in Rally's "headline-first" hero: the title block spans
 * the page, then the gallery sits left of the price, buy box and under-button
 * rows. They share one grid so the buy box sits beside the gallery on
 * desktop, but stay in SOP order in the DOM and on mobile.
 */
export function HeroSections() {
  return (
    <div
      id="top"
      className="mx-auto grid max-w-7xl scroll-mt-20 grid-cols-1 gap-x-10 gap-y-6 px-4 pt-5 pb-12 sm:px-6 lg:grid-cols-[1fr_1.1fr] lg:grid-rows-[auto_auto_auto_1fr] lg:gap-x-14 lg:pt-10"
    >
      <section
        data-sop-section="above-the-fold"
        aria-label="Product overview"
        className="contents"
      >
        <TitleBlock className="lg:col-span-2 lg:row-start-1 lg:pb-4" />
        <div className="lg:col-start-1 lg:row-span-3 lg:row-start-2">
          {/* top-22 clears the 4rem sticky header. */}
          <div className="lg:sticky lg:top-22">
            <Gallery />
          </div>
        </div>
        <div className="space-y-5 lg:col-start-2 lg:row-start-2">
          <PriceAndBullets />
        </div>
      </section>
      <div className="lg:col-start-2 lg:row-start-3">
        <BuyBox />
      </div>
      <div className="lg:col-start-2 lg:row-start-4">
        <UnderButton />
      </div>
    </div>
  );
}

/** The title block, centred above the gallery from the lg breakpoint. */
function TitleBlock({ className }: { className?: string }) {
  const { copy } = useOffer();

  return (
    <div className={cn("space-y-3 lg:text-center", className)}>
      {copy.headline && (
        <p
          className={cn(
            scoreLabel,
            "bg-primary text-primary-foreground inline-flex items-center gap-2 px-2 py-1",
          )}
        >
          {copy.headline}
        </p>
      )}
      <ProofLine />
      <h1 className="font-heading mx-auto max-w-4xl text-[2.1rem] leading-none font-bold tracking-[-0.035em] text-balance sm:text-5xl">
        <span
          className={cn(scoreLabel, "text-muted-foreground mb-3 block text-sm")}
        >
          {brand.productName}
        </span>
        {capitalise(brand.pdp.titleBenefit)}
      </h1>
      <p className="text-muted-foreground mx-auto max-w-2xl text-base sm:text-lg">
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
    <div className="flex flex-col gap-1.5 lg:items-center">
      <RatingBadge className="lg:justify-center" />
      <p
        data-proof="customers"
        className={cn(
          scoreLabel,
          "text-muted-foreground flex flex-wrap items-center gap-2 lg:justify-center",
        )}
      >
        {fillProof(brand.pdp.proofLine)}
        <PlaceholderTag kind="illustrative" label="Illustrative count" />
      </p>
    </div>
  );
}

function PriceAndBullets() {
  const { price, bundle } = useSelection();
  const bundleName = brand.bundleNames[bundle.id].title;

  return (
    <div className="space-y-5">
      <div className="border-foreground flex flex-wrap items-center gap-x-3 gap-y-2 border-y-2 py-3">
        <span className="font-heading text-3xl font-bold tabular-nums">
          {money(price.total)}
        </span>
        <s className="text-muted-foreground text-lg tabular-nums">
          {money(price.compareAt)}
        </s>
        <span
          className={cn(
            scoreLabel,
            "bg-primary text-primary-foreground px-2 py-1",
          )}
        >
          You save {money(price.saving)}
        </span>
        <span className="text-muted-foreground w-full text-sm">
          {bundleName} · {money(price.perUnit)} per sleeve
          {price.giftValue > 0 &&
            ` · ${money(price.giftValue)} of gifts included`}
        </span>
        <PlaceholderTag kind="illustrative" />
      </div>

      <ul className="grid sm:grid-cols-2">
        {brand.pdp.bullets.map((bullet) => {
          const Icon = featureIcons[bullet.icon];
          return (
            <li
              key={bullet.text}
              className="flex items-start gap-3 border-b py-2.5 text-[0.95rem] leading-snug sm:odd:pe-4"
            >
              <span
                aria-hidden="true"
                className="bg-secondary text-primary flex size-7 shrink-0 items-center justify-center"
              >
                <Icon className="size-[18px]" />
              </span>
              <span className="pt-0.5">{bullet.text}</span>
            </li>
          );
        })}
      </ul>
      <TrustRow variant="strip" count={3} />
    </div>
  );
}
