import type { ReactNode } from "react";

import { cn } from "~/lib/utils";

import { scoreLabel } from "./score-label";

/** A section's eyebrow, heading and subheading in Rally's type style. */
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
          className={cn(scoreLabel, onDark ? "text-primary" : "text-highlight")}
        >
          ● {eyebrow}
        </p>
      ) : null}
      <h2
        id={id}
        className="font-heading text-3xl leading-none font-extrabold tracking-[-0.035em] text-balance uppercase sm:text-5xl"
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
