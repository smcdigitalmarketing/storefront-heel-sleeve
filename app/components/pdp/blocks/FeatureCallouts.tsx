import { useState, type CSSProperties } from "react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import { scoreLabel } from "~/components/brand/score-label";
import { Button } from "~/components/ui/button";
import { brand } from "~/content/brand";
import { product } from "~/content/product";
import { cn } from "~/lib/utils";

/**
 * Numbered pins on the studio photo with a matching list. Hovering or
 * focusing either side highlights the other; on phones the pins stay and the
 * list sits under the photo.
 */
export function FeatureCallouts() {
  const [active, setActive] = useState<number | null>(null);
  const callouts = product.callouts;

  const pin = (i: number) =>
    cn(
      scoreLabel,
      "flex size-7 items-center justify-center text-xs transition motion-reduce:transition-none sm:size-8 sm:text-sm",
      active === i
        ? "scale-125 bg-primary text-primary-foreground"
        : "bg-secondary text-primary",
    );

  return (
    <div
      data-block="callouts"
      className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6"
    >
      <SectionHeading eyebrow={`${callouts.length} details`}>
        {brand.pdp.calloutsHeadline}
      </SectionHeading>
      <div className="mt-10 grid items-center gap-8 lg:grid-cols-[1.2fr_1fr] lg:gap-14">
        <div className="relative overflow-hidden border-2 border-foreground">
          <Img
            image="product-studio"
            sizes="(min-width: 1024px) 55vw, 100vw"
            className="aspect-square w-full object-cover"
          />
          {callouts.map((callout, i) => (
            // The wrapper does the positioning, so the button's own press
            // nudge doesn't fight the centring translate.
            <span
              key={callout.title}
              className="absolute top-(--y) left-(--x) -translate-x-1/2 -translate-y-1/2"
              style={
                {
                  "--x": `${callout.x}%`,
                  "--y": `${callout.y}%`,
                } as CSSProperties
              }
            >
              <Button
                variant="ghost"
                size="icon"
                aria-label={`${i + 1}: ${callout.title}`}
                aria-describedby={`callout-${i}`}
                onMouseEnter={() => setActive(i)}
                onMouseLeave={() => setActive(null)}
                onFocus={() => setActive(i)}
                onBlur={() => setActive(null)}
                onClick={() => setActive(active === i ? null : i)}
                className="size-11 rounded-none hover:bg-transparent aria-expanded:bg-transparent"
              >
                <span aria-hidden className={pin(i)}>
                  {i + 1}
                </span>
              </Button>
            </span>
          ))}
        </div>
        <ol className="grid gap-x-6 border-t-2 border-foreground sm:grid-cols-2 lg:grid-cols-1">
          {callouts.map((callout, i) => (
            <li
              key={callout.title}
              id={`callout-${i}`}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              className={cn(
                "flex gap-4 border-b p-3 transition motion-reduce:transition-none",
                active === i && "bg-muted",
              )}
            >
              <span aria-hidden className={cn(pin(i), "shrink-0")}>
                {i + 1}
              </span>
              <span>
                <span className={cn(scoreLabel, "block text-sm")}>
                  {callout.title}
                </span>
                <span className="text-sm text-muted-foreground">
                  {callout.body}
                </span>
              </span>
            </li>
          ))}
          <li className="px-3 pt-3">
            <PlaceholderTag
              kind="listed"
              label="Read from the reference product: confirm with the supplier"
            />
          </li>
        </ol>
      </div>
    </div>
  );
}
