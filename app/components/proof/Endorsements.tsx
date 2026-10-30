import { QuoteIcon } from "lucide-react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { Card } from "~/components/ui/card";
import { brand } from "~/content/brand";
import { proof } from "~/content/proof";
import { cn } from "~/lib/utils";

const PRESS_TILTS = ["-rotate-1", "rotate-1", "-rotate-[0.5deg]"];
/** Long placeholder labels wrap on phones instead of widening the layout. */
const WRAP = "h-auto whitespace-normal";

/** Expert slot: a placeholder until a real, consenting expert is found. */
export function ExpertQuote({ className }: { className?: string }) {
  const { expert } = proof;
  return (
    <figure
      data-proof="expert"
      className={cn(
        "grid items-center gap-6 rounded-3xl border-2 bg-secondary p-6 text-secondary-foreground sm:grid-cols-[9rem_1fr] sm:gap-8",
        className,
      )}
    >
      <Img
        image={expert.image}
        sizes="9rem"
        alt=""
        className="aspect-square w-28 rounded-full border-2 object-cover sm:w-full"
      />
      <div className="space-y-4">
        <p className="font-heading text-sm font-bold">
          {brand.pdp.expertHeadline}
        </p>
        <blockquote className="font-heading text-2xl leading-tight font-extrabold text-balance">
          “{expert.quote}”
        </blockquote>
        <figcaption className="space-y-2 text-sm">
          <span className="block font-semibold">{expert.name}</span>
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

/** Press slots. Outlet names are placeholders, never real publications. */
export function PressQuotes({ className }: { className?: string }) {
  return (
    <div data-proof="press" className={className}>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <h3 className="font-heading text-2xl font-extrabold">
          {brand.pdp.pressHeadline}
        </h3>
        <PlaceholderTag
          kind="placeholder"
          label="Press slots: placeholder outlets and quotes"
        />
      </div>
      <ul className="grid gap-4 md:grid-cols-3">
        {proof.press.map((item, i) => (
          <li key={i} className="flex">
            <Card
              className={cn(
                "flex-1 gap-4 rounded-lg border-2 p-5 text-base shadow-none ring-0",
                PRESS_TILTS[i % PRESS_TILTS.length],
              )}
            >
              <QuoteIcon aria-hidden className="size-6 opacity-40" />
              <blockquote className="flex-1 font-semibold text-balance">
                “{item.quote}”
              </blockquote>
              <p className="font-heading text-sm font-bold tracking-wide uppercase opacity-70">
                {item.outlet}
              </p>
            </Card>
          </li>
        ))}
      </ul>
    </div>
  );
}
