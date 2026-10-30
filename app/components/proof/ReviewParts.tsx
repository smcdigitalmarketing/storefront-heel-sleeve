import { CornerDownRightIcon, ThumbsUpIcon } from "lucide-react";
import { useState } from "react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { Button } from "~/components/ui/button";
import { brand } from "~/content/brand";
import { formatReviewDate } from "~/content/reviews";
import type { Review } from "~/content/types";
import { cn } from "~/lib/utils";

/** "Duo · Bubblegum", in Flashpop's own names. */
export function variantLabel(review: Review) {
  const { variant } = review;
  if (!variant) return null;
  return (
    [
      variant.bundle && brand.bundleNames[variant.bundle]?.title,
      variant.colour && brand.store.colourNames[variant.colour],
    ]
      .filter(Boolean)
      .join(" · ") || null
  );
}

/** Name, date and what they bought. */
export function ReviewByline({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) {
  const bought = variantLabel(review);
  return (
    <p className={cn("text-sm", className)}>
      <span className="font-semibold">{review.name}</span>
      <span className="opacity-70">
        {" · "}
        <time dateTime={review.date}>{formatReviewDate(review.date)}</time>
      </span>
      {bought ? (
        <span className="block text-xs opacity-70">Bought: {bought}</span>
      ) : null}
    </p>
  );
}

export function ReviewTitle({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) {
  return (
    <h3
      className={cn(
        "font-heading text-xl leading-tight font-extrabold text-balance",
        className,
      )}
    >
      {review.title}
    </h3>
  );
}

/** The brand's public reply to a review. */
export function ReviewReply({ review }: { review: Review }) {
  if (!review.reply) return null;
  return (
    <div className="mt-3 flex gap-2 border-s-2 border-current/30 ps-3 text-sm">
      <CornerDownRightIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
      <p>
        <span className="block font-semibold">Reply from {brand.name}</span>
        <span className="opacity-80">{review.reply}</span>
      </p>
    </div>
  );
}

/** Source line, placeholder label and the (illustrative) helpful count. */
export function ReviewFooter({
  review,
  className,
}: {
  review: Review;
  className?: string;
}) {
  const [voted, setVoted] = useState(false);
  return (
    <div className={cn("mt-4 space-y-2 text-xs", className)}>
      <p className="opacity-70">{review.source}</p>
      <div className="flex flex-wrap items-center gap-2">
        <PlaceholderTag kind="review-placeholder" />
        <Button
          variant="ghost"
          aria-pressed={voted}
          onClick={() => setVoted((v) => !v)}
          className="ms-auto h-11 gap-1 rounded-full px-3 text-xs tabular-nums hover:bg-current/10 hover:text-current"
        >
          <ThumbsUpIcon
            aria-hidden
            className={cn("size-3.5", voted && "fill-current")}
          />
          Helpful ({review.helpful + (voted ? 1 : 0)})
        </Button>
      </div>
    </div>
  );
}
