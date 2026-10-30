import type { ComponentProps, ReactNode } from "react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

type Tone = "primary" | "secondary" | "onDark";
type Size = "md" | "lg";

/**
 * Rally's kit-label button: square, a 2px Night outline and condensed caps.
 * Primary is a lime fill that turns Night on hover; secondary is a card;
 * onDark is an outline for Night bands. Layered on the shadcn Button's default
 * and outline variants.
 */
export function brandButtonClass(tone: Tone = "primary", size: Size = "md") {
  return cn(
    "font-heading rounded-none border-2 font-extrabold whitespace-normal uppercase",
    size === "lg" ? "h-14 px-7 text-base" : "h-11 px-5 text-sm",
    tone === "primary" &&
      "border-foreground hover:bg-secondary hover:text-primary",
    tone === "secondary" &&
      "border-foreground bg-card text-card-foreground hover:bg-secondary hover:text-secondary-foreground",
    tone === "onDark" &&
      "border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary bg-transparent",
  );
}

export function brandButtonVariant(tone: Tone = "primary") {
  return tone === "primary" ? ("default" as const) : ("outline" as const);
}

/** A store link styled as Rally's kit-label button. */
export function BrandLinkButton({
  to,
  tone = "primary",
  size = "md",
  className,
  children,
  ...props
}: Omit<ComponentProps<typeof Link>, "className" | "children"> & {
  tone?: Tone;
  size?: Size;
  className?: string;
  children: ReactNode;
}) {
  return (
    <Button
      asChild
      variant={brandButtonVariant(tone)}
      className={cn(brandButtonClass(tone, size), className)}
    >
      <Link to={to} {...props}>
        {children}
      </Link>
    </Button>
  );
}
