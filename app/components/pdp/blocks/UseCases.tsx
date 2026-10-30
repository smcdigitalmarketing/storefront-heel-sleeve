import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import { scoreLabel } from "~/components/brand/score-label";
import { brand } from "~/content/brand";
import { images } from "~/content/images";
import { cn } from "~/lib/utils";

/**
 * Four situations the product is made for, with a photo each, in a grid ruled
 * with 2px Night lines (the list draws the top and left edges, each item its
 * right and bottom, so the lines never double up).
 */
export function UseCases() {
  const { useCases } = brand.pdp;

  return (
    <div
      data-block="use-cases"
      className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6"
    >
      <SectionHeading>{useCases.headline}</SectionHeading>
      <ul className="mt-10 grid border-t-2 border-l-2 border-foreground sm:grid-cols-2 lg:grid-cols-4">
        {useCases.items.map((item, i) => (
          <li
            key={item.title}
            className="border-r-2 border-b-2 border-foreground"
          >
            <div className="relative">
              <Img
                image={item.image}
                sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                className="aspect-[4/3] w-full object-cover"
              />
              <span
                aria-hidden
                className={cn(
                  scoreLabel,
                  "absolute bottom-0 left-0 bg-secondary px-2 py-1 text-[10px] text-accent",
                )}
              >
                Use {String(i + 1).padStart(2, "0")}
              </span>
            </div>
            <div className="space-y-2 p-4">
              <h3 className="font-heading text-xl leading-none font-extrabold uppercase italic">
                {item.title}
              </h3>
              <p className="text-[0.95rem] text-muted-foreground">
                {item.body}
              </p>
              {images[item.image].status === "competitor-original" ? (
                <PlaceholderTag kind="competitor" />
              ) : null}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
