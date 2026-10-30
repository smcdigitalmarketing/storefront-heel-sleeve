import { scoreLabel } from "~/components/brand/score-label";
import { cn } from "~/lib/utils";

/** A store page's sticker eyebrow, display title and intro. */
export function PageTitle({
  eyebrow,
  title,
  intro,
  align = "start",
  className,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  align?: "start" | "center";
  className?: string;
}) {
  const centred = align === "center";
  return (
    <div
      className={cn(
        "mx-auto max-w-7xl px-4 pt-10 pb-8 sm:px-6 sm:pt-16",
        centred && "text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className={cn(scoreLabel, "text-highlight mb-3")}>
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "font-heading max-w-4xl text-4xl leading-[0.92] font-extrabold tracking-[-0.01em] text-balance uppercase italic sm:text-6xl lg:text-7xl",
          centred && "mx-auto",
        )}
      >
        {title}
      </h1>
      {intro ? (
        <p
          className={cn(
            "text-muted-foreground mt-5 max-w-2xl text-lg",
            centred && "mx-auto",
          )}
        >
          {intro}
        </p>
      ) : null}
    </div>
  );
}
