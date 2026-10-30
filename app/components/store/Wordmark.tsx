import { brand } from "~/content/brand";
import { cn } from "~/lib/utils";

const SIZES = {
  md: "text-2xl",
  lg: "text-4xl sm:text-5xl",
};

/**
 * The provisional wordmark (brand.logoNote): italic condensed caps over a
 * skewed lime field-line bar. Type-led so it can change cheaply.
 */
export function Wordmark({
  size = "md",
  className,
}: {
  size?: keyof typeof SIZES;
  className?: string;
}) {
  return (
    <span
      role="img"
      aria-label={brand.name}
      className={cn(
        "font-heading relative inline-flex items-center pe-[0.1em] leading-none font-extrabold tracking-[0.01em] whitespace-nowrap uppercase italic",
        SIZES[size],
        className,
      )}
    >
      {brand.name}
      <span
        aria-hidden
        className="bg-primary absolute inset-x-[0.06em] -bottom-[0.12em] h-[0.12em] -skew-x-[18deg]"
      />
    </span>
  );
}
