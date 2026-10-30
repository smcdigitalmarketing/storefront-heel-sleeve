import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { proof } from "~/content/proof";
import { cn } from "~/lib/utils";

/**
 * Customer photo wall: review photos and sample shots, all competitor
 * originals. Rally's contact sheet: tight Night frames, each photo numbered.
 */
export function PhotoWall({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ul className="grid grid-cols-2 gap-1 sm:grid-cols-4 lg:grid-cols-6">
        {proof.ugc.map((image, i) => (
          <li key={image} className="relative bg-secondary p-1">
            <Img
              image={image}
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
              className="aspect-square w-full object-cover"
            />
            <span
              aria-hidden
              className={cn(
                scoreLabel,
                "absolute bottom-2 left-2 bg-secondary px-1.5 py-0.5 text-[0.65rem] leading-none text-accent",
              )}
            >
              #{String(i + 1).padStart(2, "0")}
            </span>
          </li>
        ))}
      </ul>
      <PlaceholderTag
        kind="competitor"
        label="Customer and sample photos from the competitor's store"
        className="mt-4 h-auto whitespace-normal"
      />
    </div>
  );
}
