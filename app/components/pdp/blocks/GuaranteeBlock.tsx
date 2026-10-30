import { PackageCheckIcon } from "lucide-react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { brand } from "~/content/brand";
import { proof } from "~/content/proof";

/** SOP closing: spell out the guarantee and how to claim it (proposed terms). */
export function GuaranteeBlock() {
  const { guarantee, warranty } = proof;

  return (
    <div
      data-block="guarantee-steps"
      data-proof="guarantee"
      className="mx-auto mt-10 max-w-5xl rounded-3xl border-2 bg-secondary p-6 text-secondary-foreground sm:p-10"
    >
      <div className="grid gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
        {/* Flashpop's sticker burst. */}
        <span className="flex size-24 items-center justify-center bg-highlight font-extrabold text-highlight-foreground [clip-path:polygon(50%_0%,61%_15%,79%_8%,80%_27%,98%_31%,88%_48%,100%_63%,82%_70%,83%_90%,64%_85%,50%_100%,36%_85%,17%_90%,18%_70%,0%_63%,12%_48%,2%_31%,20%_27%,21%_8%,39%_15%)]">
          <span className="text-center font-heading text-xl leading-none">
            {guarantee.days}
            <span className="block text-[10px]">days</span>
          </span>
        </span>
        <div className="space-y-2">
          <h3 className="flex flex-wrap items-center gap-2 font-heading text-2xl font-extrabold sm:text-3xl">
            {brand.pdp.guaranteeHeadline}
            <PlaceholderTag kind="tbc" label="Proposed terms" />
          </h3>
          <p className="text-lg">{guarantee.body}</p>
        </div>
      </div>

      <ol className="mt-8 grid gap-4 sm:grid-cols-3">
        {guarantee.steps.map((step, i) => (
          <li
            key={step.title}
            className="space-y-1.5 rounded-lg bg-card p-4 text-card-foreground"
          >
            {/* Tomato is for large text only; small labels use Cobalt. */}
            <p className="font-heading text-sm font-bold text-primary">
              Step {i + 1}
            </p>
            <p className="font-semibold">{step.title}</p>
            <p className="text-sm text-muted-foreground">{step.body}</p>
          </li>
        ))}
      </ol>

      <p className="mt-6 flex items-start gap-3 text-sm">
        <PackageCheckIcon aria-hidden className="mt-0.5 size-5 shrink-0" />
        <span>
          <span className="font-semibold">{warranty.title}.</span>{" "}
          {warranty.body}
        </span>
      </p>
    </div>
  );
}
