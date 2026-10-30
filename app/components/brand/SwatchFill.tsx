import { cn } from "~/lib/utils";

/** A black sleeve with its trim colour as a diagonal stripe, like the product. */
export function SwatchFill({
  colour,
  className,
}: {
  colour: string;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "border-foreground/20 bg-foreground relative block overflow-hidden border transition motion-safe:group-hover/toggle:scale-110",
        className,
      )}
    >
      <span
        className="absolute inset-x-[-25%] top-1/2 h-[26%] -translate-y-1/2 -rotate-45"
        style={{ backgroundColor: colour }}
      />
    </span>
  );
}
