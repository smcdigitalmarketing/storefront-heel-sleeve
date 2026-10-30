import {
  ClockIcon,
  InfoIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { ShortReview } from "~/components/pdp/sections/BuyBox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { HEEL_NOTE, product } from "~/content/product";
import { cn } from "~/lib/utils";

import { useSelection } from "../selection";

/**
 * SOP section 3: shipping, returns, guarantee, the heel note and one urgency
 * line. No payment badges. Nothing here is invented: unconfirmed policies say so, and urgency
 * only appears on the Black Friday presentation, without a deadline, because
 * none has been set.
 */
export function UnderButton() {
  const { offerId } = useSelection();
  const { shipping, returns, guarantee } = product.policies;

  const rows = [
    { icon: TruckIcon, ...shipping },
    { icon: RotateCcwIcon, ...returns },
    { icon: ShieldCheckIcon, ...guarantee },
  ];

  return (
    <section
      data-sop-section="under-the-button"
      aria-label="Delivery, returns and a review"
      className="space-y-4"
    >
      {offerId === "black-friday" && (
        <p
          className={cn(
            scoreLabel,
            "border-foreground flex items-center gap-2 border-2 px-3 py-2",
          )}
        >
          <ClockIcon aria-hidden className="size-4 shrink-0" />
          <span>Black Friday pricing. End date not set yet.</span>
          <PlaceholderTag kind="tbc" className="ms-auto shrink-0" />
        </p>
      )}

      <ItemGroup className="border-foreground bg-card text-card-foreground gap-0 rounded-none border-2">
        {rows.map((row) => (
          <Item
            key={row.title}
            role="listitem"
            size="sm"
            className="not-last:border-foreground/30 flex-nowrap items-start gap-3 rounded-none border-0 py-3 not-last:border-b"
          >
            <ItemMedia variant="icon">
              <row.icon aria-hidden className="size-5" />
            </ItemMedia>
            <ItemContent className="min-w-0">
              {/* The label sits by the title so the body keeps the full width on phones. */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <ItemTitle className={scoreLabel}>{row.title}</ItemTitle>
                <PlaceholderTag kind="tbc" />
              </div>
              <ItemDescription className="line-clamp-none">
                {row.body}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
      <p
        data-block="heel-note"
        className="border-foreground flex items-start gap-2.5 border-l-4 ps-3 text-sm"
      >
        <InfoIcon aria-hidden className="mt-0.5 size-4 shrink-0" />
        {HEEL_NOTE}
      </p>
      <ShortReview />
    </section>
  );
}
