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
        <p className="bg-secondary font-heading text-secondary-foreground mb-3 inline-block -rotate-2 rounded-full px-3 py-1 text-sm font-bold">
          {eyebrow}
        </p>
      ) : null}
      <h1
        className={cn(
          "font-heading max-w-4xl text-4xl leading-[0.92] font-extrabold tracking-[-0.035em] text-balance sm:text-6xl lg:text-7xl",
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
