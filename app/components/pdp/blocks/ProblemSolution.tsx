import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import { scoreLabel } from "~/components/brand/score-label";
import { brand } from "~/content/brand";
import { images } from "~/content/images";
import { cn } from "~/lib/utils";

/** "Why we made it": the problem the product answers, in the brand's voice. */
export function ProblemSolution() {
  const { problem } = brand.pdp;

  return (
    <div
      data-block="problem"
      className={cn(
        "mx-auto mb-20 grid max-w-7xl items-center gap-10 px-4 sm:mb-28 sm:px-6",
        problem.image && "lg:grid-cols-2 lg:gap-16",
      )}
    >
      {problem.image ? (
        // The "before" in black and white, framed by a 2px Night rule.
        <div className="relative border-2 border-foreground">
          <Img
            image={problem.image}
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/3] w-full object-cover grayscale"
          />
          <span
            aria-hidden
            className={cn(
              scoreLabel,
              "absolute top-0 left-0 bg-secondary px-2 py-1 text-[10px] text-accent",
            )}
          >
            Pre-game
          </span>
          {images[problem.image].status === "competitor-original" ? (
            <PlaceholderTag
              kind="competitor"
              className="absolute bottom-2 left-2 bg-secondary text-secondary-foreground"
            />
          ) : null}
        </div>
      ) : null}
      <div
        className={cn(
          "space-y-5",
          !problem.image && "mx-auto max-w-3xl text-center",
        )}
      >
        <SectionHeading
          eyebrow={problem.eyebrow}
          align={problem.image ? "start" : "center"}
        >
          {problem.headline}
        </SectionHeading>
        {problem.body.map((p, i) => (
          <p
            key={p}
            className={cn(
              "leading-relaxed",
              i === 0 ? "text-lg" : "text-muted-foreground",
            )}
          >
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
