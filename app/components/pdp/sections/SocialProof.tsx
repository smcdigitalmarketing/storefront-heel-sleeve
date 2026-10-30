import { ChevronDownIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Img } from "~/components/brand/Img";
import { SectionHeading } from "~/components/brand/SectionHeading";
import { scoreLabel } from "~/components/brand/score-label";
import { ExpertQuote, PressQuotes } from "~/components/proof/Endorsements";
import { RatingSummary, Stars } from "~/components/proof/Rating";
import {
  ReviewByline,
  ReviewFooter,
  ReviewReply,
  ReviewTitle,
} from "~/components/proof/ReviewParts";
import { ReviewPhotos } from "~/components/proof/ReviewPhotos";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { brand } from "~/content/brand";
import { fillProof, proof } from "~/content/proof";
import {
  REVIEW_SORTS,
  productReviews,
  sortReviews,
  type ReviewSort,
} from "~/content/reviews";
import type { Review } from "~/content/types";
import { cn } from "~/lib/utils";

const PAGE = 12;
/** The topic chip that clears the topic filter. */
const ALL_TOPICS = "all";

/**
 * SOP section 5: the rating summary, customer photos, then a wall of reviews
 * shown up front (never a carousel) that filters by stars and theme, sorts,
 * and grows 12 at a time. Then the expert and press slots. Every number and
 * review is a labelled placeholder until real reviews exist. In Rally's look
 * the whole section sits on Night and the reviews are a numbered match log.
 */
export function SocialProof() {
  const [stars, setStars] = useState<number | null>(null);
  const [theme, setTheme] = useState<string | null>(null);
  const [sort, setSort] = useState<ReviewSort>("relevant");
  const [shown, setShown] = useState(PAGE);

  const filtered = useMemo(
    () =>
      sortReviews(
        productReviews.filter(
          (r) =>
            (!stars || r.rating === stars) &&
            (!theme || r.tags.includes(theme)),
        ),
        sort,
      ),
    [stars, theme, sort],
  );
  const visible = filtered.slice(0, shown);
  const filtering = stars !== null || theme !== null;
  const reset = (fn: () => void) => {
    fn();
    setShown(PAGE);
  };

  return (
    <section
      id="reviews"
      data-sop-section="social-proof"
      aria-labelledby="reviews-heading"
      className="scroll-mt-4 bg-secondary py-16 text-secondary-foreground sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading
          id="reviews-heading"
          sub={fillProof(brand.pdp.reviewsSub)}
          onDark
        >
          {brand.pdp.reviewsHeadline}
        </SectionHeading>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start">
          <RatingSummary
            selected={stars}
            onSelect={(s) => reset(() => setStars(s))}
            onDark
          />
          <ReviewPhotos />
        </div>

        <Toolbar
          theme={theme}
          onTheme={(t) => reset(() => setTheme(t))}
          sort={sort}
          onSort={(s) => reset(() => setSort(s))}
        />

        <p
          aria-live="polite"
          className={cn(
            scoreLabel,
            "mt-6 flex min-h-11 flex-wrap items-center gap-x-3",
          )}
        >
          Showing {visible.length} of {filtered.length} reviews
          {stars !== null && ` · ${stars} star${stars > 1 ? "s" : ""}`}
          {theme && ` · ${proof.themes.find((t) => t.id === theme)?.label}`}
          {filtering ? (
            <Button
              variant="link"
              onClick={() =>
                reset(() => {
                  setStars(null);
                  setTheme(null);
                })
              }
              className={cn(
                scoreLabel,
                "h-11 gap-1 px-1 text-secondary-foreground hover:decoration-secondary-foreground focus-visible:ring-primary/60",
              )}
            >
              <XIcon aria-hidden className="size-3.5" />
              Clear filters
            </Button>
          ) : null}
        </p>

        <div className="mt-6 sm:mt-8">
          {visible.length === 0 ? (
            <p className="py-10 text-center text-lg">
              No reviews match these filters yet.
            </p>
          ) : (
            <LogRows reviews={visible} />
          )}
        </div>

        {filtered.length > shown ? (
          <div className="mt-10 flex justify-center">
            <Button
              variant="outline"
              onClick={() => setShown((n) => n + PAGE)}
              className={cn(
                scoreLabel,
                "h-12 gap-2 rounded-none border-2 border-primary bg-transparent px-6 text-primary shadow-none hover:bg-primary hover:text-primary-foreground focus-visible:border-primary focus-visible:ring-primary/60",
              )}
            >
              Show more reviews
              <ChevronDownIcon aria-hidden className="size-4" />
            </Button>
          </div>
        ) : null}

        <div className="mt-16 grid gap-10 sm:mt-24">
          <ExpertQuote />
          <PressQuotes />
        </div>
      </div>
    </section>
  );
}

function Toolbar({
  theme,
  onTheme,
  sort,
  onSort,
}: {
  theme: string | null;
  onTheme: (theme: string | null) => void;
  sort: ReviewSort;
  onSort: (sort: ReviewSort) => void;
}) {
  const counts = proof.themes.map((t) => ({
    ...t,
    count: productReviews.filter((r) => r.tags.includes(t.id)).length,
  }));
  // Rally's scoreboard chips: square, a faint Chalk rule, lime when on.
  const chip = cn(
    scoreLabel,
    "h-11 gap-1.5 rounded-none border border-secondary-foreground/40 px-3.5 hover:border-secondary-foreground hover:bg-transparent hover:text-secondary-foreground data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-primary-foreground focus-visible:ring-primary/60",
  );

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-secondary-foreground/15 pt-6 lg:flex-row lg:items-center lg:justify-between">
      <ToggleGroup
        type="single"
        aria-label="Filter reviews by topic"
        value={theme ?? ALL_TOPICS}
        // Clicking the active topic again deselects it (""), which means all topics.
        onValueChange={(value) =>
          onTheme(value && value !== ALL_TOPICS ? value : null)
        }
        className="-mx-4 w-auto justify-start overflow-x-auto px-4 py-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0 sm:py-0"
      >
        <ToggleGroupItem value={ALL_TOPICS} className={chip}>
          All topics
        </ToggleGroupItem>
        {counts.map((t) => (
          <ToggleGroupItem key={t.id} value={t.id} className={chip}>
            {t.label}
            <span className="tabular-nums opacity-70">{t.count}</span>
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <div className="flex shrink-0 items-center gap-2">
        <Label htmlFor="review-sort" className={scoreLabel}>
          Sort by
        </Label>
        <Select value={sort} onValueChange={(v) => onSort(v as ReviewSort)}>
          <SelectTrigger
            id="review-sort"
            className={cn(
              scoreLabel,
              "rounded-none border border-secondary-foreground px-3 shadow-none focus-visible:border-primary focus-visible:ring-primary/60 data-[size=default]:h-11 [&>svg]:text-secondary-foreground",
            )}
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {REVIEW_SORTS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}

// Rally's match log: numbered rows under a lime rule, on the Night section.
function LogRows({ reviews }: { reviews: Review[] }) {
  return (
    <ol className="border-t-2 border-primary">
      {reviews.map((review, i) => (
        <li
          key={review.id}
          data-review-card
          className="grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-2 border-b border-secondary-foreground/15 py-5 sm:grid-cols-[3rem_6rem_1fr_13rem] sm:items-start"
        >
          <span className={cn(scoreLabel, "pt-1 text-accent")}>
            #{String(i + 1).padStart(2, "0")}
          </span>
          {review.photo ? (
            <Img
              image={review.photo}
              sizes="96px"
              className="hidden aspect-square w-full object-cover sm:block"
            />
          ) : (
            <span aria-hidden className="hidden sm:block" />
          )}
          <div className="col-start-2 min-w-0 sm:col-start-auto">
            <ReviewTitle review={review} />
            <blockquote className="mt-1.5 text-base leading-snug opacity-90 sm:text-lg">
              {review.body}
            </blockquote>
            <ReviewReply review={review} />
          </div>
          <div className="col-start-2 flex flex-col gap-2 text-sm sm:col-start-auto sm:items-end sm:text-end">
            <span className="text-primary">
              <Stars rating={review.rating} className="size-3.5" />
            </span>
            <ReviewByline review={review} />
            <ReviewFooter
              review={review}
              className="mt-0 sm:[&>div]:justify-end"
            />
          </div>
        </li>
      ))}
    </ol>
  );
}
