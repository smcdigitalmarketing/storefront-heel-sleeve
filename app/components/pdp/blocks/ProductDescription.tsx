import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { brand } from "~/content/brand";
import type { ContentStatus, Fact } from "~/content/types";
import { cn } from "~/lib/utils";

/** The long product description, in the brand's voice (SOP section 4). */
export function ProductDescription({
  facts,
  className,
}: {
  /** "At a glance" rows: label, value and where each one stands. */
  facts: Pick<Fact, "label" | "value" | "status">[];
  className?: string;
}) {
  const [lead, ...rest] = brand.pdp.description;
  const listed = facts.some((f) => f.status === "competitor-listed");

  return (
    <div data-block="description" className={cn("space-y-6", className)}>
      <p className="text-lg leading-relaxed font-medium sm:text-xl">{lead}</p>
      {rest.map((p) => (
        <p key={p} className="leading-relaxed text-muted-foreground">
          {p}
        </p>
      ))}
      <div className="rounded-3xl border-2 bg-secondary p-5 text-secondary-foreground">
        <p className="mb-3 font-heading text-sm font-extrabold">At a glance</p>
        <dl className="grid grid-cols-[7.5rem_1fr] gap-x-4 gap-y-2 text-sm">
          {facts.map((f) => (
            <div key={f.label} className="contents">
              <dt className="text-muted-foreground">{f.label}</dt>
              <dd className="flex flex-wrap items-center gap-2">
                {f.value}
                <RowTag status={f.status} />
              </dd>
            </div>
          ))}
        </dl>
        {listed ? (
          <PlaceholderTag
            kind="listed"
            label="Specs as listed for the reference product, to be confirmed"
            className="mt-4"
          />
        ) : null}
      </div>
    </div>
  );
}

/**
 * Competitor-listed rows share the box's label; anything else that isn't
 * confirmed (to be confirmed, illustrative, placeholder) is labelled on its row.
 */
function RowTag({ status }: { status: ContentStatus }) {
  if (status === "confirmed" || status === "competitor-listed") return null;
  return <PlaceholderTag kind={status === "tbc" ? "tbc" : "placeholder"} />;
}
