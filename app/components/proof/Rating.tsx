import { StarIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { Button } from "~/components/ui/button";
import { Progress } from "~/components/ui/progress";
import { proof } from "~/content/proof";
import { cn } from "~/lib/utils";

export type RatingData = typeof proof.rating;

/** Stars filled to the exact average (4.8 fills 96%). */
export function RatingStars({
  value,
  className,
}: {
  value: number;
  className?: string;
}) {
  const row = (filled: boolean) =>
    Array.from({ length: 5 }, (_, i) => (
      <StarIcon
        key={i}
        aria-hidden
        className={cn("shrink-0", className, filled && "fill-current")}
      />
    ));
  return (
    <span
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
      className="relative inline-flex"
    >
      <span className="flex gap-[0.15em] opacity-25">{row(false)}</span>
      <span
        className="absolute inset-y-0 left-0 flex w-(--fill) gap-[0.15em] overflow-hidden"
        style={{ "--fill": `${(value / 5) * 100}%` } as CSSProperties}
      >
        {row(true)}
      </span>
    </span>
  );
}

/** Whole stars for a single review (the mock's slide name). */
export function Stars({
  rating,
  className,
}: {
  rating: number;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="flex gap-[0.15em]"
    >
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          aria-hidden
          className={cn(className, i < rating ? "fill-current" : "opacity-25")}
        />
      ))}
    </span>
  );
}

/** "★★★★★ 4.8 · 1,284 reviews", linking to the review wall. */
export function RatingBadge({
  rating = proof.rating,
  href = "#reviews",
  className,
  onDark,
}: {
  rating?: RatingData;
  href?: string | null;
  className?: string;
  onDark?: boolean;
}) {
  const count = rating.count.toLocaleString("en-US");
  const label = (
    <>
      <span className="font-semibold tabular-nums">
        {rating.average.toFixed(1)}
      </span>
      <span className={cn(!onDark && "text-muted-foreground")}>
        {" · "}
        {count} reviews
      </span>
    </>
  );
  return (
    <div
      data-proof="rating"
      className={cn(
        scoreLabel,
        "flex flex-wrap items-center gap-x-2 gap-y-1",
        className,
      )}
    >
      <span className={cn(!onDark && "text-highlight")}>
        <RatingStars value={rating.average} className="size-4" />
      </span>
      {href ? (
        <a
          href={href}
          className="decoration-primary decoration-2 underline-offset-4 hover:underline"
          aria-label={`Rated ${rating.average.toFixed(1)} out of 5 from ${count} reviews. Read the reviews`}
        >
          {label}
        </a>
      ) : (
        <span>{label}</span>
      )}
      <PlaceholderTag kind="illustrative" label="Illustrative rating" />
    </div>
  );
}

/**
 * Big average, stars, count, the 5→1 bars and % who recommend, in a square
 * 2px frame. With `onSelect`, each bar is a toggle that filters the wall by
 * stars. `onDark` is for Night bands: a faint Chalk rule and lime stars and
 * bars instead of the Night rule and dark lime.
 */
export function RatingSummary({
  rating = proof.rating,
  selected,
  onSelect,
  className,
  onDark,
}: {
  rating?: RatingData;
  selected?: number | null;
  onSelect?: (stars: number | null) => void;
  className?: string;
  onDark?: boolean;
}) {
  const max = Math.max(...rating.distribution);

  return (
    <div
      data-proof="rating"
      className={cn(
        "grid gap-6 rounded-none border-2 p-5 sm:grid-cols-[auto_minmax(12rem,1fr)] sm:items-center sm:gap-10 sm:p-6",
        onDark ? "border-secondary-foreground/20" : "border-foreground",
        className,
      )}
    >
      <div className="space-y-2">
        <p className="font-heading text-7xl leading-none font-extrabold tracking-[-0.02em] italic tabular-nums">
          {rating.average.toFixed(1)}
          <span className="sr-only"> out of 5</span>
        </p>
        <span className={onDark ? "text-primary" : "text-highlight"}>
          <RatingStars value={rating.average} className="size-5" />
        </span>
        <p className={scoreLabel}>
          Based on {rating.count.toLocaleString("en-US")} reviews
        </p>
        <p className="text-sm font-semibold">
          {rating.recommend}% would recommend it to a friend
        </p>
        <PlaceholderTag kind="illustrative" label="Illustrative rating" />
      </div>

      <ol className="space-y-1" aria-label="Reviews by star rating">
        {rating.distribution.map((n, i) => {
          const stars = 5 - i;
          const active = selected === stars;
          const count = n.toLocaleString("en-US");
          const bar = (
            <>
              <span className={cn(scoreLabel, "w-14 shrink-0 text-start")}>
                {stars} star{stars > 1 ? "s" : ""}
              </span>
              <Progress
                aria-hidden
                value={(n / max) * 100}
                className={cn(
                  "h-2.5 flex-1 rounded-none bg-current/15",
                  onDark
                    ? "*:data-[slot=progress-indicator]:bg-primary"
                    : "*:data-[slot=progress-indicator]:bg-highlight",
                )}
              />
              <span className="w-12 shrink-0 text-end text-sm tabular-nums opacity-75">
                {count}
              </span>
            </>
          );
          return (
            <li key={stars}>
              {onSelect ? (
                <Button
                  variant="ghost"
                  aria-pressed={active}
                  aria-label={`${stars} star reviews: ${count}. ${active ? "Show all reviews" : `Show only ${stars} star reviews`}`}
                  onClick={() => onSelect(active ? null : stars)}
                  className={cn(
                    "h-11 w-full justify-start gap-3 rounded-none px-1.5 font-normal hover:bg-current/10 hover:text-current focus-visible:ring-current/50",
                    active && "bg-current/10 font-semibold",
                  )}
                >
                  {bar}
                </Button>
              ) : (
                <div className="flex items-center gap-3 px-1.5 py-1">{bar}</div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
