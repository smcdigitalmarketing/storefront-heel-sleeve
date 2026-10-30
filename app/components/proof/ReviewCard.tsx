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

/** A full review card in Flashpop's style: ink outline, offset shadow, a slight tilt. */
export function ReviewCard({
  review,
  index = 0,
  photo = true,
  className,
}: {
  review: Review;
  index?: number;
  photo?: boolean;
  className?: string;
}) {
  return (
    <Card
      data-review-card
      className={cn(
        "gap-3 overflow-visible rounded-lg p-5 text-base shadow-[4px_4px_0_0] ring-2 shadow-foreground ring-foreground",
        index % 2 ? "rotate-[0.6deg]" : "-rotate-[0.6deg]",
        className,
      )}
    >
      {photo && review.photo ? (
        <div className="overflow-hidden rounded-sm">
          <Img
            image={review.photo}
            sizes="(min-width: 768px) 30vw, 100vw"
            className="aspect-[3/2] w-full object-cover"
          />
        </div>
      ) : null}
      <span className="text-highlight">
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
