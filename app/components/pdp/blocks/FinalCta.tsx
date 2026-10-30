import { ArrowUpIcon } from "lucide-react";

import { RatingBadge } from "~/components/proof/Rating";
import { Button } from "~/components/ui/button";
import { brand } from "~/content/brand";
import { fillProof } from "~/content/proof";
import { cn } from "~/lib/utils";

/** The last call to action: rating, offer recap and a button back to the buy box. */
export function FinalCta() {
  const { finalCta } = brand.pdp;

  return (
    <div
      data-block="final-cta"
      className="relative overflow-hidden bg-highlight px-4 py-16 text-highlight-foreground sm:px-6 sm:py-20"
    >
      <div className="relative mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <RatingBadge onDark className="justify-center" href="#reviews" />
        <h2 className="font-heading text-4xl leading-[0.95] font-extrabold tracking-[-0.03em] text-balance sm:text-6xl">
          {finalCta.headline}
        </h2>
        <p className="max-w-xl text-lg opacity-90">
          {fillProof(finalCta.body)}
        </p>
        {/* Back up to the buy box (#buy), as the mock does. */}
        <Button
          asChild
          className={cn(
            "h-auto min-h-14 gap-2 rounded-full border-2 border-border px-8 py-3 font-heading text-lg font-extrabold whitespace-normal",
            "shadow-[4px_4px_0_0] shadow-foreground hover:bg-primary hover:shadow-[2px_2px_0_0]",
          )}
        >
          <a href="#buy">
            {finalCta.cta}
            <ArrowUpIcon aria-hidden className="size-4" />
          </a>
        </Button>
      </div>
    </div>
  );
}
