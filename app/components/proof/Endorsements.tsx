import { QuoteIcon } from "lucide-react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { Card } from "~/components/ui/card";
import { brand } from "~/content/brand";
import { proof } from "~/content/proof";
import { cn } from "~/lib/utils";

/** Long placeholder labels wrap on phones instead of widening the layout. */
const WRAP = "h-auto whitespace-normal";

/**
 * Expert slot: a placeholder until a real, consenting expert is found. A square
 * 2px frame that takes its colours from the band it sits on (Night in Rally's
 * proof section), with a greyscale portrait.
 */
export function ExpertQuote({ className }: { className?: string }) {
  const { expert } = proof;
  return (
    <figure
      data-proof="expert"
      className={cn(
        "grid items-center gap-6 rounded-none border-2 border-current/20 p-6 sm:grid-cols-[9rem_1fr] sm:gap-8",
        className,
      )}
    >
      <Img
        image={expert.image}
        sizes="9rem"
        alt=""
        className="aspect-square w-28 object-cover grayscale sm:w-full"
      />
      <div className="space-y-4">
        <p className={scoreLabel}>{brand.pdp.expertHeadline}</p>
        <blockquote className="font-heading text-2xl leading-snug font-extrabold text-balance italic">
          “{expert.quote}”
        </blockquote>
        <figcaption className="space-y-2 text-sm">
          <span className={cn(scoreLabel, "block")}>{expert.name}</span>
          <span className="block opacity-75">{expert.role}</span>
          <PlaceholderTag
            kind="placeholder"
            label="Expert slot: replace with a real, consenting expert"
            className={WRAP}
          />
        </figcaption>
      </div>
    </figure>
  );
}

/**
 * Press slots. Outlet names are placeholders, never real publications. Square
 * frames in the band's own colours, outlets in scoreboard caps.
 */
export function PressQuotes({ className }: { className?: string }) {
  return (
    <div data-proof="press" className={className}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className={scoreLabel}>{brand.pdp.pressHeadline}</h3>
        <PlaceholderTag
          kind="placeholder"
          label="Press slots: placeholder outlets and quotes"
        />
      </div>
      <ul className="grid gap-4 md:grid-cols-3">
        {proof.press.map((item, i) => (
          <li key={i} className="flex">
            <Card className="flex-1 gap-4 rounded-none border-2 border-current/20 bg-transparent p-5 text-base text-current shadow-none ring-0">
              <QuoteIcon aria-hidden className="size-6 opacity-40" />
              <blockquote className="flex-1 text-lg text-balance">
                “{item.quote}”
              </blockquote>
              <p className={cn(scoreLabel, "opacity-70")}>{item.outlet}</p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
