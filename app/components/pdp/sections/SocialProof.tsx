import { ChevronDownIcon, XIcon } from "lucide-react";
import { useMemo, useState } from "react";

import { Img } from "~/components/brand/Img";
import { SectionHeading } from "~/components/brand/SectionHeading";
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
import { Card } from "~/components/ui/card";
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
 * review is a labelled placeholder until real reviews exist.
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
      className="scroll-mt-4 bg-primary py-16 text-primary-foreground sm:py-24"
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
          className="mt-6 flex min-h-11 flex-wrap items-center gap-x-3 text-sm"
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
              className="h-11 gap-1 px-1 font-semibold text-primary-foreground underline focus-visible:ring-primary-foreground/60"
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
            <StickyNotes reviews={visible} />
          )}
        </div>

        {filtered.length > shown ? (
          <div className="mt-10 flex justify-center">
            <Button
              variant="secondary"
              onClick={() => setShown((n) => n + PAGE)}
              className="h-12 gap-2 rounded-full border-2 border-border px-6 font-heading font-semibold shadow-[3px_3px_0_0] shadow-foreground hover:shadow-none focus-visible:ring-primary-foreground/60"
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
  const chip =
    "h-11 gap-1.5 rounded-full border-2 border-primary-foreground/40 px-3.5 text-sm font-medium hover:border-primary-foreground hover:bg-transparent hover:text-primary-foreground data-[state=on]:border-border data-[state=on]:bg-secondary data-[state=on]:text-secondary-foreground focus-visible:ring-primary-foreground/60";

  return (
    <div className="mt-10 flex flex-col gap-4 border-t border-primary-foreground/15 pt-6 lg:flex-row lg:items-center lg:justify-between">
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
        <Label htmlFor="review-sort" className="font-normal">
          Sort by
        </Label>
        <Select value={sort} onValueChange={(v) => onSort(v as ReviewSort)}>
          <SelectTrigger
            id="review-sort"
            className="rounded-full border-2 border-primary-foreground px-3 font-semibold shadow-none focus-visible:border-primary-foreground focus-visible:ring-primary-foreground/60 data-[size=default]:h-11 [&>svg]:text-primary-foreground"
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

// Flashpop's sticky notes: paper colours from the palette, each at a tilt.
const NOTE_COLOURS = [
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-card text-card-foreground",
  // The mock's fifth note is mint (#B9F3D2), which has no theme token.
  "bg-muted text-foreground",
  "bg-highlight text-highlight-foreground",
];
const NOTE_TILTS = [
  "-rotate-2",
  "rotate-1",
  "rotate-2",
  "-rotate-1",
  "rotate-0",
];

function StickyNotes({ reviews }: { reviews: Review[] }) {
  return (
    <ul className="columns-1 gap-5 sm:columns-2 lg:columns-3">
      {reviews.map((review, i) => (
        <li
          key={review.id}
          data-review-card
          className="mb-5 break-inside-avoid"
        >
          <Card
            className={cn(
              "gap-0 overflow-visible rounded-[4px] p-5 text-base shadow-[0_12px_24px_-12px] ring-0 shadow-foreground/45 hover:rotate-0 motion-safe:transition",
              NOTE_COLOURS[i % NOTE_COLOURS.length],
              NOTE_TILTS[i % NOTE_TILTS.length],
            )}
          >
            {review.photo ? (
              <div className="mb-4 -rotate-1 bg-card p-2 pb-7 shadow-xl">
                <Img
                  image={review.photo}
                  sizes="(min-width: 1024px) 30vw, 90vw"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            ) : null}
            <Stars rating={review.rating} className="size-4" />
            <ReviewTitle review={review} className="mt-3" />
            <p className="mt-2 text-[0.95rem] leading-snug">“{review.body}”</p>
            <ReviewByline review={review} className="mt-4" />
            <ReviewReply review={review} />
            <ReviewFooter review={review} />
          </Card>
        </li>
      ))}
    </ul>
  );
}
