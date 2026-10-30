import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { brand } from "~/content/brand";
import { fillProof } from "~/content/proof";
import { cn } from "~/lib/utils";

/** A founder-style note with a sign-off. */
export function BrandPromise() {
  const { promise } = brand.pdp;

  return (
    <div
      data-block="promise"
      className="mx-auto mt-20 max-w-3xl px-4 sm:mt-28 sm:px-6"
    >
      <figure className="relative -rotate-[0.6deg] space-y-5 rounded-3xl border-2 bg-accent p-7 text-accent-foreground shadow-[8px_8px_0_0] shadow-foreground sm:p-10">
        <p className="font-heading text-3xl leading-none font-extrabold">
          {promise.headline}
        </p>
        <blockquote className="space-y-4">
          {promise.body.map((p, i) => (
            <p
              key={p}
              className={cn("leading-relaxed", i === 0 && "text-lg sm:text-xl")}
            >
              {fillProof(p)}
            </p>
          ))}
        </blockquote>
        <figcaption className="font-heading text-xl font-extrabold">
          — {promise.signoff}
        </figcaption>
        <PlaceholderTag kind="tbc" label="Guarantee terms to be confirmed" />
      </figure>
    </div>
  );
}
