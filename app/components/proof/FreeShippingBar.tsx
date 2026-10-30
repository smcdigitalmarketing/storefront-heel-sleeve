import { TruckIcon } from "lucide-react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { Progress } from "~/components/ui/progress";
import { proof } from "~/content/proof";
import { useCart } from "~/lib/cart";
import { formatPrice } from "~/lib/money";
import { cn } from "~/lib/utils";

/**
 * "$12.00 away from free shipping", with a progress bar toward
 * proof.shipping.freeOver, read from the Hydrogen cart's subtotal. The
 * threshold is a proposal, so it's labelled "to be confirmed". Rally's
 * scoreboard caps over a square bar; the fill is dark lime because the bar sits
 * on light grounds (the cart page and drawer), where lime wouldn't show.
 */
export function FreeShippingBar({ className }: { className?: string }) {
  const subtotal = useCart((state) => state.data.cost.subtotalAmount);
  const target = proof.shipping.freeOver;
  const spent = Number.parseFloat(subtotal?.amount ?? "0") || 0;
  const gap = Math.max(0, Math.round((target - spent) * 100) / 100);
  const done = gap === 0;
  const currencyCode = subtotal?.currencyCode ?? "USD";
  const progress = Math.min(100, (spent / target) * 100);

  return (
    <div data-proof="free-shipping" className={cn("space-y-2", className)}>
      <p
        aria-live="polite"
        className={cn(scoreLabel, "flex flex-wrap items-center gap-2 text-xs")}
      >
        <TruckIcon aria-hidden="true" className="size-4 shrink-0" />
        {done ? (
          <span className="font-semibold">
            You&apos;ve unlocked free standard shipping
          </span>
        ) : (
          <span>
            You&apos;re{" "}
            <span className="font-semibold">
              {formatPrice({ amount: gap.toFixed(2), currencyCode })}
            </span>{" "}
            away from free shipping
          </span>
        )}
        <PlaceholderTag kind="tbc" />
      </p>
      <Progress
        value={progress}
        aria-label="Progress to free shipping"
        className="h-2 rounded-none bg-foreground/10 *:data-[slot=progress-indicator]:bg-highlight"
      />
    </div>
  );
}
