import {
  ClockIcon,
  RotateCcwIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { ShortReview } from "~/components/pdp/sections/BuyBox";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item";
import { product } from "~/content/product";

import { useSelection } from "../selection";

/**
 * SOP section 3: shipping, returns, guarantee and one urgency line. No payment
 * badges. Nothing here is invented: unconfirmed policies say so, and urgency
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
        <p className="bg-foreground text-secondary flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium">
          <ClockIcon aria-hidden className="size-4 shrink-0" />
          <span>Black Friday pricing. End date not set yet.</span>
          {/* text-current: the outline badge's ink text would vanish on ink. */}
          <PlaceholderTag
            kind="tbc"
            className="ms-auto shrink-0 text-current"
          />
        </p>
      )}

      <ItemGroup className="border-border/10 bg-card text-card-foreground gap-0 rounded-lg border-2">
        {rows.map((row) => (
          <Item
            key={row.title}
            role="listitem"
            size="sm"
            className="not-last:border-border/10 flex-nowrap items-start gap-3 rounded-none border-0 py-3 not-last:border-b"
          >
            <ItemMedia variant="icon">
              <row.icon aria-hidden className="size-5" />
            </ItemMedia>
            <ItemContent className="min-w-0">
              {/* The label sits by the title so the body keeps the full width on phones. */}
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <ItemTitle className="font-semibold">{row.title}</ItemTitle>
                <PlaceholderTag kind="tbc" />
              </div>
              <ItemDescription className="line-clamp-none">
                {row.body}
              </ItemDescription>
            </ItemContent>
          </Item>
        ))}
      </ItemGroup>
      <ShortReview />
    </section>
  );
}
