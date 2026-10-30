import {
  MessageCircleIcon,
  PackageCheckIcon,
  ShieldCheckIcon,
  TruckIcon,
} from "lucide-react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { proof } from "~/content/proof";
import { cn } from "~/lib/utils";

export function trustItems() {
  return [
    {
      icon: TruckIcon,
      title: `Free shipping over $${proof.shipping.freeOver}`,
      body: proof.shipping.dispatch,
    },
    {
      icon: ShieldCheckIcon,
      title: `${proof.guarantee.days}-day guarantee`,
      body: "Love it or get a full refund",
    },
    {
      icon: PackageCheckIcon,
      title: proof.warranty.title,
      body: "Repair or replace if it fails",
    },
    {
      icon: MessageCircleIcon,
      title: proof.support.title,
      body: "Replies within one business day",
    },
  ];
}

const STRIP_TONES = [
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-card text-card-foreground",
];
const BAND_TONES = [
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-highlight text-highlight-foreground",
  "bg-card text-card-foreground",
];

/**
 * Shipping, guarantee, warranty and support, all proposed terms.
 * - strip: one compact row (above the fold, item pages)
 * - band: four columns (homepage, product page)
 * - list: stacked (cart and checkout)
 */
export function TrustRow({
  variant = "band",
  count = 4,
  className,
}: {
  variant?: "strip" | "band" | "list";
  count?: number;
  className?: string;
}) {
  const items = trustItems().slice(0, count);

  return (
    <div data-proof="trust" className={className}>
      <ul
        className={cn(
          variant === "strip" &&
            "grid grid-cols-3 gap-2 text-center text-xs sm:text-sm",
          variant === "band" &&
            "grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4",
          variant === "list" && "space-y-3 text-sm",
        )}
      >
        {items.map((item, i) => (
          <li
            key={item.title}
            className={cn(
              variant === "strip" &&
                cn(
                  "flex flex-col items-center gap-1.5 rounded-lg border-2 px-1 py-3",
                  STRIP_TONES[i % STRIP_TONES.length],
                ),
              variant === "band" && "flex flex-col gap-3",
              variant === "list" && "flex items-start gap-3",
            )}
          >
            <span
              className={cn(
                "flex shrink-0 items-center justify-center",
                variant === "band" &&
                  cn(
                    "size-12 rounded-full border-2",
                    BAND_TONES[i % BAND_TONES.length],
                  ),
              )}
            >
              <item.icon
                aria-hidden
                className={variant === "band" ? "size-6" : "size-5"}
              />
            </span>
            <span className="min-w-0">
              <span
                className={cn(
                  "block font-semibold",
                  variant === "band" && "font-heading text-lg font-extrabold",
                )}
              >
                {item.title}
              </span>
              <span
                className={cn(
                  "block",
                  variant === "strip"
                    ? "hidden opacity-70 sm:block"
                    : "opacity-75",
                )}
              >
                {item.body}
              </span>
            </span>
          </li>
        ))}
      </ul>
      <PlaceholderTag
        kind="tbc"
        label="Proposed shipping, guarantee and support terms"
        className={cn(
          "h-auto whitespace-normal",
          variant === "band" ? "mt-6" : "mt-2",
        )}
      />
    </div>
  );
}
