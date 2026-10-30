import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";

const LABELS = {
  illustrative: "Illustrative pricing",
  placeholder: "Placeholder",
  tbc: "To be confirmed",
  listed: "As listed by competitor",
  competitor: "Competitor source",
  "review-placeholder": "Placeholder review",
} as const;

export type PlaceholderKind = keyof typeof LABELS;

/**
 * Marks content that isn't approved for launch: illustrative prices and
 * proof, unconfirmed specs, competitor stand-in images. A dashed outline badge,
 * so reviewers can always tell it apart from brand UI.
 */
export function PlaceholderTag({
  kind,
  label,
  className,
}: {
  kind: PlaceholderKind;
  label?: string;
  className?: string;
}) {
  return (
    <Badge
      variant="outline"
      data-placeholder={kind}
      // Long labels wrap instead of widening the layout on phones.
      className={cn(
        // text-current: the tag takes its colour from its surroundings, so it
        // shows on dark bands as well as light ones.
        "h-auto max-w-full border-dashed border-current text-left whitespace-normal text-current uppercase opacity-75",
        className,
      )}
    >
      {label ?? LABELS[kind]}
    </Badge>
  );
}
