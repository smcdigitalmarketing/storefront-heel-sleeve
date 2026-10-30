import { XIcon } from "lucide-react";
import { useState } from "react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "~/components/ui/dialog";
import { photoReviews } from "~/content/reviews";
import type { Review } from "~/content/types";
import { cn } from "~/lib/utils";

import { Stars } from "./Rating";
import {
  ReviewByline,
  ReviewFooter,
  ReviewReply,
  ReviewTitle,
} from "./ReviewParts";

/** Customer photos from reviews; each opens its review. No carousel (SOP). */
export function ReviewPhotos({ className }: { className?: string }) {
  // The review stays set while the dialog animates closed.
  const [review, setReview] = useState<Review | null>(null);
  const [open, setOpen] = useState(false);

  if (!photoReviews.length) return null;
  return (
    <div className={className}>
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <h3 className={cn(scoreLabel, "text-sm")}>Customer photos</h3>
        <PlaceholderTag
          kind="competitor"
          label="Photos from competitor reviews"
        />
      </div>
      <ul className="grid grid-cols-4 gap-2 sm:grid-cols-5 lg:grid-cols-9">
        {photoReviews.map((item) => (
          <li key={item.id}>
            <Button
              variant="outline"
              onClick={() => {
                setReview(item);
                setOpen(true);
              }}
              aria-label={`Photo from ${item.name}'s review: ${item.title}`}
              className="group block aspect-square h-auto w-full overflow-hidden rounded-none border-2 border-current/20 bg-current/10 p-0 shadow-none hover:border-primary hover:bg-current/10 hover:text-current focus-visible:border-primary focus-visible:ring-primary/50"
            >
              <Img
                image={item.photo!}
                sizes="(min-width: 1024px) 9vw, 25vw"
                alt=""
                className="size-full object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none"
              />
            </Button>
          </li>
        ))}
      </ul>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          aria-describedby={undefined}
          showCloseButton={false}
          className="max-h-[90dvh] gap-0 overflow-y-auto rounded-none border-2 border-foreground bg-background p-0 text-foreground ring-0 sm:max-w-3xl"
        >
          {/* First in the DOM, so it takes the initial focus. */}
          <DialogClose asChild>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-3 right-3 z-10 size-11 rounded-none border-2 border-foreground"
            >
              <XIcon aria-hidden />
              <span className="sr-only">Close</span>
            </Button>
          </DialogClose>
          {review ? (
            <div className="grid sm:grid-cols-2">
              <Img
                image={review.photo!}
                sizes="(min-width: 640px) 24rem, 100vw"
                className="aspect-square w-full object-cover"
              />
              <div className="space-y-3 p-5 text-base sm:p-6">
                <span className="text-highlight">
                  <Stars rating={review.rating} className="size-4" />
                </span>
                <DialogTitle asChild>
                  <div>
                    <ReviewTitle review={review} />
                  </div>
                </DialogTitle>
                <p>“{review.body}”</p>
                <ReviewByline review={review} />
                <ReviewReply review={review} />
                <ReviewFooter review={review} />
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
