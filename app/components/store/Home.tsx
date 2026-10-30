// Rally's brand home, ported from the mock's components/store/Home.tsx
// (rally branches only): the game-day hero, ticker, featured colours,
// reviews, story and newsletter. Rally has no 360° spins, so the mock's
// scroll-driven angles section is left out.

import { ArrowRightIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

import { Divider } from "~/components/brand/Divider";
import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { RatingBadge } from "~/components/proof/Rating";
import { ReviewCard } from "~/components/proof/ReviewCard";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { brand } from "~/content/brand";
import { getColour, LEAD_COLOUR, type ColourId } from "~/content/catalog";
import { money } from "~/content/offers";
import { fillProof, ratingCount } from "~/content/proof";
import { wallReviews } from "~/content/reviews";
import { useReducedMotion } from "~/lib/motion";
import { useOffer } from "~/lib/offer";
import { cn } from "~/lib/utils";

import { BrandLinkButton } from "./BrandButton";
import { ColourSwatches, ColourThumbs } from "./ColourSwatches";
import { PRODUCT_PATH, storePaths } from "./nav";

const home = brand.store.home;

/** Rally's section heading (the mock's useHeading, rally branch). */
export const HEADING =
  "font-heading text-4xl leading-[0.95] font-extrabold tracking-[-0.01em] text-balance uppercase italic sm:text-6xl";

export function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Featured />
      <ReviewsTeaser />
      <Story />
      <Newsletter />
    </>
  );
}

/* ---------------- Hero ---------------- */

/** The quarter in the hero's scoreboard label: Q1 to Q4, every 2.4s. Decoration only. */
function useQuarter() {
  const reduced = useReducedMotion();
  const [quarter, setQuarter] = useState(1);
  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setQuarter((q) => (q % 4) + 1), 2400);
    return () => clearInterval(id);
  }, [reduced]);
  return quarter;
}

function Hero() {
  const hero = home.hero;
  const quarter = useQuarter();
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="bg-secondary text-secondary-foreground"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-10 pb-14 sm:px-6 lg:grid-cols-[1fr_1.25fr] lg:items-center lg:pt-16 lg:pb-20">
        <div className="motion-safe:animate-hero-rise space-y-6">
          <p className={cn(scoreLabel, "text-accent")}>{hero.eyebrow}</p>
          <h1
            id="home-hero-heading"
            className="font-heading text-6xl leading-[0.88] font-extrabold tracking-[-0.01em] uppercase italic sm:text-8xl"
          >
            {hero.headline}
          </h1>
          <p className="max-w-md text-lg opacity-80">{hero.sub}</p>
          <ul className="bg-secondary-foreground/20 border-secondary-foreground/20 grid grid-cols-2 gap-px border text-sm">
            {brand.pdp.bullets.map((bullet) => (
              <li key={bullet.text} className="bg-secondary p-3">
                <span aria-hidden className={cn(scoreLabel, "text-primary")}>
                  ●
                </span>{" "}
                {bullet.text}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-3">
            <BrandLinkButton to={PRODUCT_PATH} size="lg">
              {hero.cta}{" "}
              <ArrowRightIcon className="size-4" aria-hidden="true" />
            </BrandLinkButton>
            <BrandLinkButton to={storePaths.how} size="lg" tone="onDark">
              {hero.secondary}
            </BrandLinkButton>
          </div>
        </div>
        <div className="border-accent relative border-2 p-2">
          <Img
            image={hero.image}
            priority
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="aspect-[3/2] w-full object-cover"
          />
          {[
            "top-4 left-4 border-t-2 border-l-2",
            "top-4 right-4 border-t-2 border-r-2",
            "bottom-4 left-4 border-b-2 border-l-2",
            "right-4 bottom-4 border-r-2 border-b-2",
          ].map((position) => (
            <span
              key={position}
              aria-hidden
              className={cn(
                "border-secondary-foreground/80 absolute size-8",
                position,
              )}
            />
          ))}
          <span
            aria-hidden
            className={cn(
              scoreLabel,
              "text-secondary-foreground absolute top-6 left-1/2 -translate-x-1/2",
            )}
          >
            <span className="text-primary motion-safe:animate-rec-blink">
              ●
            </span>{" "}
            Game day
          </span>
          <span
            aria-hidden
            className={cn(
              scoreLabel,
              "bg-secondary/80 text-accent absolute right-6 bottom-6 px-2 py-1",
            )}
          >
            Q{quarter}
          </span>
          <PlaceholderTag
            kind="competitor"
            className="text-secondary-foreground absolute bottom-6 left-6"
          />
        </div>
      </div>
      <Divider />
    </section>
  );
}

/* ---------------- Ticker ---------------- */

function Ticker() {
  const items = [...home.ticker, ...home.ticker];
  return (
    <div className="bg-primary text-primary-foreground overflow-hidden border-y-2 border-foreground py-3">
      <p className="sr-only">{home.ticker.join(", ")}</p>
      {/* Two copies of the doubled list: the marquee slides by half its width. */}
      <ul
        className="motion-safe:animate-marquee flex w-max gap-8"
        aria-hidden="true"
      >
        {[...items, ...items].map((item, i) => (
          <li
            key={i}
            className="font-heading flex items-center gap-8 text-lg font-extrabold whitespace-nowrap uppercase italic"
          >
            {item}
            <span className={scoreLabel}>●</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ---------------- Featured sleeve with live colour swap ---------------- */

function Featured() {
  const featured = home.featured;
  const { offer } = useOffer();
  const [colour, setColour] = useState<ColourId>(LEAD_COLOUR);
  const single =
    offer.bundles.find((bundle) => bundle.quantity === 1) ?? offer.bundles[0];

  return (
    <section aria-labelledby="home-featured-heading" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2">
        <div className="bg-card border-foreground relative aspect-square overflow-hidden border-2">
          <Img
            key={colour}
            image={getColour(colour).studio}
            alt={`${brand.productName}, ${brand.store.colourNames[colour]}`}
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="motion-safe:animate-colour-in size-full object-cover"
          />
          <PlaceholderTag
            kind="competitor"
            className="absolute bottom-3 left-3"
          />
        </div>
        <div className="space-y-6">
          <p className={cn(scoreLabel, "text-highlight")}>{featured.eyebrow}</p>
          <h2 id="home-featured-heading" className={HEADING}>
            {featured.headline}
          </h2>
          <p className="text-muted-foreground max-w-md text-lg">
            {featured.body}
          </p>
          <ColourSwatches value={colour} onChange={setColour} />
          <ColourThumbs value={colour} onChange={setColour} />
          <div className="flex flex-wrap items-center gap-4">
            <BrandLinkButton to={`${PRODUCT_PATH}?colour=${colour}`} size="lg">
              {featured.cta} · {money(single.price)}
            </BrandLinkButton>
            <PlaceholderTag
              kind="illustrative"
              label="Illustrative price and colour range"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Reviews ---------------- */

function ReviewsTeaser() {
  const picks = wallReviews.slice(0, 6);
  const reviewsHref = `${PRODUCT_PATH}#reviews`;
  return (
    <section
      aria-labelledby="home-reviews-heading"
      className="bg-secondary text-secondary-foreground border-primary border-t-4 py-20 sm:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 space-y-3">
          <h2 id="home-reviews-heading" className={HEADING}>
            {home.reviewsHeadline}
          </h2>
          <p className="text-lg opacity-80">
            {fillProof(brand.pdp.reviewsSub)}
          </p>
        </div>
        <RatingBadge href={reviewsHref} onDark className="mb-10" />
        <ul role="list" className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {picks.map((review, i) => (
            <li key={review.id} className="flex">
              <ReviewCard review={review} index={i} className="flex-1" />
            </li>
          ))}
        </ul>
        <div className="mt-10">
          <Link
            to={reviewsHref}
            className="decoration-primary inline-flex min-h-11 items-center gap-1 font-semibold underline decoration-2 underline-offset-4"
          >
            Read all {ratingCount} reviews{" "}
            <ArrowRightIcon className="size-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Story ---------------- */

function Story() {
  const story = home.story;
  return (
    <section aria-labelledby="home-story-heading" className="py-20 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 md:grid-cols-2">
        <div className="border-foreground border-2 p-2">
          <Img
            image={story.image}
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-[4/5] w-full object-cover"
          />
        </div>
        <div className="space-y-6">
          <h2 id="home-story-heading" className={HEADING}>
            {story.headline}
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            {story.body}
          </p>
          <BrandLinkButton to={storePaths.about} tone="secondary">
            {story.cta}
          </BrandLinkButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------- Newsletter ---------------- */

function Newsletter() {
  const copy = home.newsletter;
  // No sign-up provider yet: the form only works once hydrated, so it never
  // falls back to a native submit that would put the email in the URL.
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);

  return (
    <section
      aria-labelledby="home-newsletter-heading"
      className="bg-secondary text-secondary-foreground py-20"
    >
      <div className="mx-auto max-w-2xl space-y-5 px-4 text-center sm:px-6">
        <h2
          id="home-newsletter-heading"
          className="font-heading text-3xl font-extrabold uppercase italic sm:text-4xl"
        >
          {copy.headline}
        </h2>
        <p className="opacity-80">{copy.body}</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            toast("Sign-up isn't connected yet", {
              description:
                "There's no mailing list behind this form yet, so your email wasn't saved or sent.",
            });
          }}
          className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row"
        >
          <Input
            required
            type="email"
            name="email"
            autoComplete="email"
            placeholder="Email address"
            aria-label="Email address"
            className="bg-card text-card-foreground h-12 min-w-0 flex-1 rounded-none border-2 px-4"
          />
          <Button
            type="submit"
            disabled={!ready}
            className="font-heading h-12 rounded-none border-2 border-primary px-6 font-extrabold uppercase"
          >
            {copy.cta}
          </Button>
        </form>
        <div className="flex justify-center">
          <PlaceholderTag
            kind="placeholder"
            label="Sign-up not connected yet · nothing is sent"
          />
        </div>
      </div>
    </section>
  );
}
