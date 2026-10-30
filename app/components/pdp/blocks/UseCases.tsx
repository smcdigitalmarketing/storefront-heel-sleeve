import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import { brand } from "~/content/brand";
import { images } from "~/content/images";
import { cn } from "~/lib/utils";

const TONES = [
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-card text-card-foreground",
  "bg-highlight text-highlight-foreground",
];

/** Four situations the product is made for, with a photo each. */
export function UseCases() {
  const { useCases } = brand.pdp;

  return (
    <div
      data-block="use-cases"
      className="mx-auto mt-20 max-w-7xl px-4 sm:mt-28 sm:px-6"
    >
      <SectionHeading>{useCases.headline}</SectionHeading>
      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {useCases.items.map((item, i) => (
          <li
            key={item.title}
            className={cn(
              "overflow-hidden rounded-3xl border-2",
              TONES[i % TONES.length],
              i % 2 ? "lg:translate-y-6" : "",
            )}
          >
            <Img
              image={item.image}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="space-y-2 p-5">
              <h3 className="font-heading text-xl leading-none font-extrabold">
                {item.title}
              </h3>
              <p className="text-[0.95rem]">{item.body}</p>
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
