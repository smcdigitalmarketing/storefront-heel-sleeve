import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { brand } from "~/content/brand";
import { fillProof } from "~/content/proof";
import { cn } from "~/lib/utils";

/** A team-style note with a sign-off, inside a 2px Night frame. */
export function BrandPromise() {
  const { promise } = brand.pdp;

  return (
    <div
      data-block="promise"
      className="mx-auto mt-20 max-w-3xl px-4 sm:mt-28 sm:px-6"
    >
      <figure className="space-y-5 border-2 border-foreground bg-card p-7 text-card-foreground sm:p-10">
        <p className={cn(scoreLabel, "text-highlight")}>
          <span aria-hidden>● </span>
          {promise.headline}
        </p>
        <blockquote className="space-y-4">
          {promise.body.map((p, i) => (
            <p
              key={p}
              className={cn(
                "leading-relaxed",
                i === 0 && "text-lg font-semibold sm:text-xl",
              )}
            >
              {fillProof(p)}
            </p>
          ))}
        </blockquote>
        <figcaption className="font-heading text-xl font-extrabold uppercase italic">
          / {promise.signoff}
        </figcaption>
        <PlaceholderTag kind="tbc" label="Guarantee terms to be confirmed" />
      </figure>
    </div>
  );
}
