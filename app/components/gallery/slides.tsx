// The seven SOP gallery slides plus the video slot, in the required order.
// Photos never carry words: every headline, label and badge is HTML laid
// over the image, so it stays editable and sharp. Text is sized in container
// units so a slide reads the same on a 375 px phone and a desktop column.
// Rally's frames carry a scoreboard counter ("01 / 07") in the corner.

import { CheckIcon, PlayIcon, XIcon } from "lucide-react";
import type { ReactNode } from "react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { Stars } from "~/components/proof/Rating";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { brand } from "~/content/brand";
import { images, type ImageId } from "~/content/images";
import { product } from "~/content/product";
import { ratingCount, ratingLabel } from "~/content/proof";
import { getReview } from "~/content/reviews";
import { cn } from "~/lib/utils";

export type Slide = {
  id: string;
  label: string;
  thumb: ImageId;
  kind: "image" | "video";
  render: (priority: boolean) => ReactNode;
};

/** SOP gallery order. Do not reorder: the content check asserts it. */
export const slides: Slide[] = [
  {
    id: "benefit",
    label: "Benefit headline",
    thumb: "gallery-benefit",
    kind: "image",
    render: (priority) => <BenefitSlide priority={priority} />,
  },
  {
    id: "in-use",
    label: "In use",
    thumb: "gallery-in-use",
    kind: "image",
    render: () => <InUseSlide />,
  },
  {
    id: "comparison",
    label: "Before and after",
    thumb: "compare-with",
    kind: "image",
    render: () => <ComparisonSlide />,
  },
  {
    id: "included",
    label: "What's included",
    thumb: "gallery-included",
    kind: "image",
    render: () => <IncludedSlide />,
  },
  {
    id: "how-it-works",
    label: "How it works",
    thumb: "step-strap",
    kind: "image",
    render: () => <HowItWorksSlide />,
  },
  {
    id: "versus",
    label: "Us vs alternatives",
    thumb: "product-studio",
    kind: "image",
    render: () => <VersusSlide />,
  },
  {
    id: "review",
    label: "Review",
    thumb: "product-thumb",
    kind: "image",
    render: () => <ReviewSlide />,
  },
  {
    id: "video",
    label: "Silent demo video",
    thumb: "product-studio",
    kind: "video",
    render: () => <VideoSlide />,
  },
];

const copy = brand.pdp.gallery;
const SIZES = "(min-width: 1024px) 50vw, 100vw";
const HEADLINE =
  "font-heading text-[9cqw] leading-[0.95] font-extrabold tracking-[-0.01em] text-balance uppercase italic";
const BAND_HEADLINE =
  "font-heading text-[6.4cqw] leading-none font-extrabold tracking-[-0.01em] text-balance uppercase italic";
const LABEL = cn(scoreLabel, "text-accent text-[2.8cqw] leading-none");

/** The scoreboard counter in a slide's corner: "01 / 07", or "08 / VIDEO". */
function frameLabel(n: number) {
  return `${String(n).padStart(2, "0")} / 07`;
}

function Frame({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  // The container is the outer box, so cqw units on the inner box (padding,
  // gaps) resolve against the slide rather than the viewport.
  return (
    <div className="@container size-full">
      <div className={cn("relative size-full overflow-hidden", className)}>
        {children}
        <span
          aria-hidden="true"
          className={cn(
            scoreLabel,
            "text-accent absolute top-[3.5cqw] right-[4cqw] text-[2.6cqw]",
          )}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

function BenefitSlide({ priority }: { priority: boolean }) {
  return (
    <Frame label={frameLabel(1)}>
      <Img
        image="gallery-benefit"
        sizes={SIZES}
        priority={priority}
        className="size-full object-cover"
      />
      <div className="from-secondary/75 via-secondary/30 absolute inset-x-0 top-0 h-3/5 bg-linear-to-b to-transparent" />
      <div className="text-secondary-foreground absolute inset-x-0 top-0 space-y-[2.6cqw] p-[6cqw] text-shadow-md">
        <p className={LABEL}>{copy.benefit.eyebrow}</p>
        <h3 className={HEADLINE}>{copy.benefit.headline}</h3>
        <p className={cn(scoreLabel, "text-accent text-[3cqw]")}>
          {copy.benefit.sub}
        </p>
      </div>
    </Frame>
  );
}

function InUseSlide() {
  return (
    <Frame label={frameLabel(2)}>
      <Img
        image="gallery-in-use"
        sizes={SIZES}
        className="size-full object-cover"
      />
      <div className="from-secondary/75 via-secondary/30 absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t to-transparent" />
      <div className="text-secondary-foreground absolute inset-x-0 bottom-0 space-y-[2cqw] p-[6cqw] text-shadow-md">
        <h3 className={HEADLINE}>{copy.inUse.headline}</h3>
        <p className={cn(scoreLabel, "text-accent text-[3cqw]")}>
          {copy.inUse.sub}
        </p>
      </div>
    </Frame>
  );
}

/** The same scene without and with the sleeve: preparation, not an outcome. */
function ComparisonSlide() {
  const panels: { image: ImageId; label: string }[] = [
    { image: "compare-without", label: copy.comparison.left },
    { image: "compare-with", label: copy.comparison.right },
  ];
  return (
    <Frame
      label={frameLabel(3)}
      className="bg-card text-card-foreground flex flex-col p-[6cqw]"
    >
      <h3 className={BAND_HEADLINE}>{copy.comparison.headline}</h3>
      <div className="mt-[5cqw] grid flex-1 grid-cols-2 items-center gap-[4cqw]">
        {panels.map((panel, i) => (
          <figure key={panel.image} className="border-foreground border-2">
            <Img
              image={panel.image}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="aspect-[4/5] max-h-[48cqw] w-full object-cover"
            />
            <figcaption
              className={cn(
                scoreLabel,
                "py-[1.2cqw] text-center text-[2.6cqw]",
                i === 1
                  ? "bg-primary text-primary-foreground"
                  : "bg-foreground text-background",
              )}
            >
              {i === 0 ? "A" : "B"} / {panel.label}
            </figcaption>
          </figure>
        ))}
      </div>
      <p className="text-muted-foreground mt-[3cqw] text-center text-[2.4cqw]">
        {copy.comparison.note}
      </p>
      {/* Stand-in photos stay labelled until our own replace them. */}
      {panels.some(
        (panel) => images[panel.image].status === "competitor-original",
      ) ? (
        <PlaceholderTag kind="competitor" className="mx-auto mt-[1.6cqw]" />
      ) : null}
    </Frame>
  );
}

function IncludedSlide() {
  return (
    <Frame
      label={frameLabel(4)}
      className="bg-card text-card-foreground flex flex-col"
    >
      <div className="space-y-[3cqw] px-[6cqw] pt-[6cqw] pb-[3cqw]">
        <h3 className={BAND_HEADLINE}>{copy.included.headline}</h3>
        <ul className="flex flex-wrap gap-[2cqw]">
          {product.included.map((item, i) => (
            <li
              key={item.name}
              className={cn(
                scoreLabel,
                "border-foreground bg-background text-foreground border px-[2.6cqw] py-[1.4cqw] text-[2.6cqw] leading-tight",
              )}
            >
              <span className="text-highlight">
                {String(i + 1).padStart(2, "0")}{" "}
              </span>
              {item.name}
              {item.detail.includes("TBC") && (
                <span className="text-muted-foreground"> · size TBC</span>
              )}
            </li>
          ))}
        </ul>
      </div>
      <div className="relative min-h-0 flex-1">
        <Img
          image="gallery-included"
          sizes={SIZES}
          className="absolute inset-0 size-full object-cover"
        />
      </div>
    </Frame>
  );
}

function HowItWorksSlide() {
  return (
    <Frame
      label={frameLabel(5)}
      className="bg-background flex flex-col p-[5cqw]"
    >
      <h3 className={cn(BAND_HEADLINE, "mb-[4cqw]")}>
        {copy.howItWorks.headline}
      </h3>
      <ol className="grid min-h-0 flex-1 grid-cols-2 grid-rows-2 gap-[3cqw]">
        {product.howItWorks.map((step, i) => (
          <li
            key={step.title}
            className={cn(
              "border-foreground relative min-h-0 overflow-hidden border-2",
              // Three steps: the first takes the whole top row.
              i === 0 && "col-span-2",
            )}
          >
            <Img
              image={step.image}
              sizes="(min-width: 1024px) 25vw, 50vw"
              className="absolute inset-0 size-full object-cover"
            />
            <div className="from-secondary/75 text-secondary-foreground absolute inset-x-0 bottom-0 flex items-center gap-[2cqw] bg-linear-to-t to-transparent p-[2.6cqw] pt-[6cqw]">
              <span className="font-heading bg-primary text-primary-foreground flex size-[6.4cqw] shrink-0 items-center justify-center text-[3.4cqw] font-bold">
                {i + 1}
              </span>
              <span className="text-[3.3cqw] leading-tight font-semibold">
                {step.title}
              </span>
            </div>
          </li>
        ))}
      </ol>
    </Frame>
  );
}

const VERSUS_ROWS: { label: string; values: [boolean, boolean, boolean] }[] = [
  { label: "Strap you can adjust", values: [true, false, false] },
  { label: "Wraps behind the heel", values: [true, false, true] },
  { label: "Reusable", values: [true, true, false] },
  { label: "Machine washable", values: [true, true, false] },
];

function VersusSlide() {
  const columns = [brand.name, "Tube sleeve", "Tape"];
  return (
    <Frame
      label={frameLabel(6)}
      className="bg-secondary text-secondary-foreground"
    >
      <Img
        image="product-studio"
        sizes={SIZES}
        className="absolute inset-0 size-full object-cover opacity-30"
      />
      <div className="relative flex size-full flex-col p-[6cqw]">
        <h3 className={BAND_HEADLINE}>{copy.versus.headline}</h3>
        <div className="mt-auto">
          <Table className="border-collapse text-[3.1cqw]">
            <TableHeader>
              <TableRow className="border-secondary-foreground/20 hover:bg-transparent">
                <TableHead className="h-auto w-[40%]" />
                {columns.map((col, i) => (
                  <TableHead
                    key={col}
                    scope="col"
                    className={cn(
                      scoreLabel,
                      "text-secondary-foreground h-auto px-[1cqw] pb-[2cqw] text-center text-[2.5cqw] whitespace-normal",
                      i === 0 && "bg-primary text-primary-foreground pt-[2cqw]",
                    )}
                  >
                    {col}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {VERSUS_ROWS.map((row) => (
                <TableRow
                  key={row.label}
                  className="border-secondary-foreground/20 hover:bg-transparent"
                >
                  <TableHead
                    scope="row"
                    className="text-secondary-foreground h-auto py-[2.4cqw] ps-0 pe-[1cqw] text-start font-medium whitespace-normal"
                  >
                    {row.label}
                  </TableHead>
                  {row.values.map((ok, i) => (
                    <TableCell
                      key={i}
                      className={cn(
                        "p-0 text-center",
                        i === 0 && "bg-primary/90 text-primary-foreground",
                      )}
                    >
                      {ok ? (
                        <CheckIcon
                          role="img"
                          aria-label="Yes"
                          className="mx-auto size-[4.4cqw]"
                          strokeWidth={3}
                        />
                      ) : (
                        <XIcon
                          role="img"
                          aria-label="No"
                          className="mx-auto size-[4cqw] opacity-50"
                        />
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </Frame>
  );
}

function ReviewSlide() {
  const review = getReview(copy.review.reviewId);
  return (
    <Frame
      label={frameLabel(7)}
      className="bg-primary text-primary-foreground flex flex-col p-[6cqw]"
    >
      <h3 className={BAND_HEADLINE}>{copy.review.headline}</h3>
      <figure className="border-foreground bg-card text-card-foreground mt-[5cqw] flex flex-1 flex-col gap-[3cqw] border-2 p-[5cqw]">
        <div className="flex items-center gap-[3cqw]">
          {review.photo && (
            <Img
              image={review.photo}
              sizes="30vw"
              className="size-[20cqw] shrink-0 object-cover"
            />
          )}
          <div className="min-w-0 space-y-[1.5cqw]">
            <Stars rating={review.rating} className="size-[4cqw]" />
            <p className="text-[3.4cqw] font-semibold">{review.name}</p>
            <PlaceholderTag
              kind="review-placeholder"
              className="text-[2.2cqw] leading-none"
            />
          </div>
        </div>
        <blockquote className="text-[4.4cqw] leading-snug font-medium">
          “{review.body}”
        </blockquote>
        <figcaption className="text-muted-foreground mt-auto text-[2.4cqw]">
          Rated {ratingLabel} out of 5 from {ratingCount} reviews (illustrative)
          · {review.source}
        </figcaption>
      </figure>
    </Frame>
  );
}

/** No footage yet (the competitor has none to port): an honest placeholder. */
function VideoSlide() {
  return (
    <Frame
      label="08 / VIDEO"
      className="bg-secondary text-secondary-foreground"
    >
      <Img
        image="product-studio"
        sizes={SIZES}
        className="size-full object-cover opacity-50"
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-[3cqw] p-[8cqw] text-center">
        <span className="bg-background/90 text-foreground flex size-[16cqw] items-center justify-center rounded-full">
          <PlayIcon
            aria-hidden
            className="size-[6cqw] translate-x-[0.4cqw]"
            fill="currentColor"
          />
        </span>
        <p className={BAND_HEADLINE}>Silent demo video</p>
        <p className="max-w-[70cqw] text-[3cqw] opacity-85">
          A short, silent clip of the sleeve going on and being worn goes here.
        </p>
        <PlaceholderTag
          kind="placeholder"
          label="Video placeholder"
          className="text-[2.4cqw]"
        />
      </div>
    </Frame>
  );
}
