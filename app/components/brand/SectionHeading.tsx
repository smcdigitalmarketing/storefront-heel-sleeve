import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

/** A section's eyebrow, heading and subheading in Flashpop's type style. */
export function SectionHeading({
  id,
  eyebrow,
  children,
  sub,
  align = "start",
  className,
  onDark,
}: {
  id?: string;
  eyebrow?: string;
  children: ReactNode;
  sub?: string;
  align?: "start" | "center";
  className?: string;
  /** On a dark band: muted text uses opacity instead of the muted colour. */
  onDark?: boolean;
}) {
  return (
    <div
      className={cn(
        "max-w-3xl space-y-3",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p
          className={cn(
            "font-heading text-sm font-bold",
            onDark ? "opacity-80" : "text-highlight",
          )}
        >
          {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="font-heading text-4xl leading-[0.95] font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl"
      >
        {children}
      </h2>
      {sub ? (
        <p
          className={cn(
            "text-base sm:text-lg",
            onDark ? "opacity-80" : "text-muted-foreground",
          )}
        >
          {sub}
        </p>
      ) : null}
    </div>
  );
}
