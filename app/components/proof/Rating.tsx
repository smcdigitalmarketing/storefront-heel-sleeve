import { StarIcon } from "lucide-react";
import type { CSSProperties } from "react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
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
        "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm",
        className,
      )}
    >
      <span className={cn(!onDark && "text-highlight")}>
        <RatingStars value={rating.average} className="size-4" />
      </span>
      {href ? (
        <a
          href={href}
          className="underline-offset-4 hover:underline"
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
 * Big average, stars, count, the 5→1 bars and % who recommend. With
 * `onSelect`, each bar is a toggle that filters the wall by stars.
 */
export function RatingSummary({
  rating = proof.rating,
  selected,
  onSelect,
  className,
}: {
  rating?: RatingData;
  selected?: number | null;
  onSelect?: (stars: number | null) => void;
  className?: string;
}) {
  const max = Math.max(...rating.distribution);

  return (
    <div
      data-proof="rating"
      className={cn(
        "grid gap-6 rounded-3xl border-2 bg-card p-5 text-card-foreground shadow-[6px_6px_0_0] shadow-foreground sm:grid-cols-[auto_minmax(12rem,1fr)] sm:items-center sm:gap-10 sm:p-7",
        className,
      )}
    >
      <div className="space-y-2">
        <p className="font-heading text-7xl leading-none font-extrabold tracking-[-0.04em] tabular-nums">
          {rating.average.toFixed(1)}
          <span className="sr-only"> out of 5</span>
        </p>
        <span className="text-highlight">
          <RatingStars value={rating.average} className="size-5" />
        </span>
        <p className="text-sm">
          Based on {rating.count.toLocaleString("en-US")} reviews
        </p>
        <p className="text-sm font-semibold">
          {rating.recommend}% would recommend it to a friend
        </p>
        <PlaceholderTag kind="illustrative" label="Illustrative rating" />
      </div>

      <ol className="space-y-0.5" aria-label="Reviews by star rating">
        {rating.distribution.map((n, i) => {
          const stars = 5 - i;
          const active = selected === stars;
          const count = n.toLocaleString("en-US");
          const bar = (
            <>
              <span className="w-14 shrink-0 text-start text-sm tabular-nums">
                {stars} star{stars > 1 ? "s" : ""}
              </span>
              <Progress
                aria-hidden
                value={(n / max) * 100}
                className="h-3 flex-1 bg-foreground/10 *:data-[slot=progress-indicator]:rounded-full *:data-[slot=progress-indicator]:bg-highlight"
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
                    "h-11 w-full justify-start gap-3 rounded-full px-1.5 font-normal hover:bg-foreground/8 hover:text-card-foreground",
                    active && "bg-foreground/10 font-semibold",
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
