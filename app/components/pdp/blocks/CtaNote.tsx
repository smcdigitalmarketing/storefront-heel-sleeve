import { ShieldCheckIcon, TruckIcon } from "lucide-react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { money } from "~/content/offers";
import { proof } from "~/content/proof";
import { cn } from "~/lib/utils";

import { useSelection } from "../selection";

/** One reassurance line under the main button: delivery and the guarantee. */
export function CtaNote() {
  const { price } = useSelection();
  const free = price.total >= proof.shipping.freeOver;

  return (
    <p
      data-proof="cta-note"
      className={cn(
        scoreLabel,
        "mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-center text-xs",
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <TruckIcon aria-hidden className="size-4" />
        {free
          ? "Free shipping"
          : `Free shipping over ${money(proof.shipping.freeOver)}`}{" "}
        · {proof.shipping.dispatch.toLowerCase()}
      </span>
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheckIcon aria-hidden className="size-4" />
        {proof.guarantee.days}-day money-back guarantee
      </span>
      <PlaceholderTag kind="tbc" />
    </p>
  );
}
