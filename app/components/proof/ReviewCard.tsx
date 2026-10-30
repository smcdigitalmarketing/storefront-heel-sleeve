import { Img } from "~/components/brand/Img";
import { Card } from "~/components/ui/card";
import type { Review } from "~/content/types";
import { cn } from "~/lib/utils";

import { Stars } from "./Rating";
import {
  ReviewByline,
  ReviewFooter,
  ReviewReply,
  ReviewTitle,
} from "./ReviewParts";

/**
 * A full review card in Rally's style: square, with a 2px rule. By default a
 * white card with a Night rule and dark lime stars, which reads on Chalk and
 * on Night bands alike. `onDark` makes it a Night card with a faint Chalk rule
 * and lime stars, for a Night band that wants the cards to sit flush.
 */
export function ReviewCard({
  review,
  photo = true,
  className,
  onDark,
}: {
  review: Review;
  /** Its position in a list. Unused: Rally's cards are all square and level. */
  index?: number;
  photo?: boolean;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <Card
      data-review-card
      className={cn(
        "gap-3 rounded-none border-2 p-5 text-base shadow-none ring-0",
        onDark
          ? "border-secondary-foreground/20 bg-secondary text-secondary-foreground"
          : "border-foreground",
        className,
      )}
    >
      {photo && review.photo ? (
        // Wrapped so Card's first-image rounding and padding rules don't apply.
        <div>
          <Img
            image={review.photo}
            sizes="(min-width: 768px) 30vw, 100vw"
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      ) : null}
      <span className={onDark ? "text-primary" : "text-highlight"}>
        <Stars rating={review.rating} className="size-4" />
      </span>
      <ReviewTitle review={review} />
      <p className="flex-1">“{review.body}”</p>
      <ReviewByline review={review} />
      <ReviewReply review={review} />
      <ReviewFooter review={review} className="mt-1" />
    </Card>
  );
}
