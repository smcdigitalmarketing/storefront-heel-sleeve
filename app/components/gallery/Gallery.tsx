import { PlayIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Img } from "~/components/brand/Img";
import { scoreLabel } from "~/components/brand/score-label";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";
import { brand } from "~/content/brand";
import { getReview } from "~/content/reviews";
import { useReducedMotion } from "~/lib/motion";
import { cn } from "~/lib/utils";

import { slides, type Slide } from "./slides";

const reviewPhoto = getReview(brand.pdp.gallery.review.reviewId).photo;
const thumbFor = (slide: Slide) =>
  slide.id === "review" ? (reviewPhoto ?? slide.thumb) : slide.thumb;

/** The 8-slide SOP gallery. */
export function Gallery({ className }: { className?: string }) {
  const [api, setApi] = useState<CarouselApi>();
  const [index, setIndex] = useState(0);
  const reduced = useReducedMotion();

  // Keep the active index in sync with arrows, keys, thumbnails and swipes.
  useEffect(() => {
    if (!api) return;
    const onSelect = () => setIndex(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect).on("reInit", onSelect);
    return () => {
      api.off("select", onSelect).off("reInit", onSelect);
    };
  }, [api]);

  return (
    <div className={cn("min-w-0", className)}>
      <Carousel
        setApi={setApi}
        // Reduced motion: arrows, keys and thumbnails jump instead of sliding.
        opts={{ loop: true, duration: reduced ? 0 : 25 }}
        aria-label={`${brand.productName} images`}
      >
        <div className="relative">
          {/* Focusable, so the left and right arrow keys change slides. */}
          <div
            tabIndex={0}
            className="border-foreground isolate overflow-hidden border-2 focus-visible:outline-3 focus-visible:-outline-offset-3 focus-visible:outline-ring"
          >
            <CarouselContent className="ml-0" aria-live="polite">
              {slides.map((slide, i) => (
                <CarouselItem
                  key={slide.id}
                  aria-label={`${i + 1} of ${slides.length}: ${slide.label}`}
                  aria-hidden={i !== index}
                  inert={i !== index}
                  data-slide={slide.id}
                  className="pl-0"
                >
                  <div className="aspect-square w-full">
                    {slide.render(i === 0)}
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>

          <div className="absolute right-3 bottom-3 flex gap-2">
            <CarouselPrevious
              aria-label="Previous image"
              size="icon-lg"
              className="border-foreground static size-11 rounded-none border-2"
            />
            <CarouselNext
              aria-label="Next image"
              size="icon-lg"
              className="border-foreground static size-11 rounded-none border-2"
            />
          </div>
          <div className="absolute bottom-3 left-3 flex items-center gap-2">
            <span
              className={cn(
                scoreLabel,
                "bg-secondary text-secondary-foreground px-2.5 py-1 text-xs",
              )}
            >
              {index + 1} / {slides.length}
            </span>
          </div>
        </div>

        <ol
          aria-label="Choose image"
          className="mt-2 flex gap-2 overflow-x-auto p-1 [scrollbar-width:none]"
        >
          {slides.map((slide, i) => (
            <li key={slide.id} className="shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => api?.scrollTo(i)}
                aria-label={`Show image ${i + 1}: ${slide.label}`}
                aria-current={i === index}
                className={cn(
                  "relative size-14 overflow-hidden rounded-none border-2 p-0 sm:size-16",
                  i === index
                    ? "border-foreground"
                    : "border-transparent opacity-70 hover:opacity-100",
                )}
              >
                <Img
                  image={thumbFor(slide)}
                  sizes="64px"
                  alt=""
                  className="size-full object-cover"
                />
                {slide.kind === "video" && (
                  <span className="absolute inset-0 flex items-center justify-center bg-foreground/40 text-background">
                    <PlayIcon className="size-4" fill="currentColor" />
                  </span>
                )}
              </Button>
            </li>
          ))}
        </ol>
      </Carousel>
    </div>
  );
}
