import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { proof } from "~/content/proof";
import { cn } from "~/lib/utils";

const TILTS = ["-rotate-2", "rotate-1", "rotate-2", "-rotate-1"];

/** Customer photo wall: review photos and sample shots, all competitor originals. */
export function PhotoWall({ className }: { className?: string }) {
  return (
    <div className={className}>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {proof.ugc.map((image, i) => (
          <li
            key={image}
            className={cn(
              "bg-card p-2 pb-7 shadow-xl",
              TILTS[i % TILTS.length],
            )}
          >
            <Img
              image={image}
              sizes="(min-width: 1024px) 16vw, (min-width: 640px) 25vw, 50vw"
              className="aspect-square w-full object-cover"
            />
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
