import { CheckIcon } from "lucide-react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { brand } from "~/content/brand";
import { product } from "~/content/product";
import { cn } from "~/lib/utils";

import { BrandPromise } from "../blocks/BrandPromise";
import { CompleteTheKit } from "../blocks/CompleteTheKit";
import { FeatureCallouts } from "../blocks/FeatureCallouts";
import { ProblemSolution } from "../blocks/ProblemSolution";
import { UseCases } from "../blocks/UseCases";

/**
 * SOP section 6: why we made it, benefit headlines with an image that backs
 * them up, the feature callouts, use cases, how it works, a stats band and a
 * comparison table, then the brand's promise and the add-ons. Stats are
 * listed specs, not performance claims.
 */
export function ValueProps() {
  return (
    <section
      data-sop-section="value-props"
      aria-labelledby="value-heading"
      className="py-16 sm:py-24"
    >
      <ProblemSolution />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHeading id="value-heading" sub={brand.pdp.valuePropsSub}>
          {brand.pdp.valuePropsHeadline}
        </SectionHeading>
        <div className="mt-10 sm:mt-14">
          <Bento />
        </div>
      </div>
      <FeatureCallouts />
      <UseCases />
      <HowItWorks />
      <StatsBand />
      <ComparisonTable />
      <BrandPromise />
      <CompleteTheKit />
    </section>
  );
}

const BENTO_SPANS = ["sm:col-span-2 sm:row-span-2", "", "", "sm:col-span-2"];
const BENTO_TONES = [
  "bg-highlight text-highlight-foreground",
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-card text-card-foreground",
];

/** Flashpop's value props: four tiles of different sizes and colours. */
function Bento() {
  return (
    <ul className="grid auto-rows-[minmax(14rem,auto)] gap-4 sm:grid-cols-4">
      {brand.pdp.valueProps.map((vp, i) => (
        <li
          key={vp.headline}
          className={cn(
            "group relative flex flex-col overflow-hidden rounded-3xl border-2",
            BENTO_SPANS[i],
            BENTO_TONES[i],
          )}
        >
          <Img
            image={vp.image}
            sizes="(min-width: 640px) 50vw, 100vw"
            className={cn(
              "w-full object-cover transition duration-500 motion-safe:group-hover:scale-[1.03]",
              i === 0 ? "h-64 sm:h-auto sm:flex-1" : "h-44",
            )}
          />
          <div className="space-y-2 p-5">
            <h3 className="font-heading text-2xl leading-none font-extrabold tracking-[-0.02em]">
              {vp.headline}
            </h3>
            <p className="text-[0.95rem]">{vp.body}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function HowItWorks() {
  return (
    <div
      id="how-it-works"
      className="mx-auto mt-20 max-w-7xl scroll-mt-4 px-4 sm:mt-28 sm:px-6"
    >
      <SectionHeading eyebrow="4 steps">
        {brand.pdp.howItWorksHeadline}
      </SectionHeading>
      <ol className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {product.howItWorks.map((step, i) => (
          <li
            key={step.title}
            className="rounded-3xl border-2 bg-card p-3 text-card-foreground"
          >
            <Img
              image={step.image}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="aspect-square w-full rounded-lg object-cover"
            />
            <div className="space-y-1 pt-4">
              <p className="font-heading text-sm font-bold text-highlight">
                Step {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-heading text-xl font-extrabold">
                {step.title}
              </h3>
              <p className="text-sm text-muted-foreground">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

function StatsBand() {
  return (
    <div className="mt-20 bg-foreground text-background sm:mt-28">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
        {product.stats.map((stat) => (
          <div key={stat.label} className="px-2">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="font-heading text-5xl leading-none font-extrabold text-secondary tabular-nums sm:text-6xl">
              {stat.value}
            </dd>
            <dd className="mt-2 text-sm">{stat.label}</dd>
          </div>
        ))}
      </dl>
      <p className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <PlaceholderTag
          kind="listed"
          label="Specs as listed for the reference camera, to be confirmed"
          className="text-background"
        />
      </p>
    </div>
  );
}

function ComparisonTable() {
  const { columns, rows } = product.comparison;
  const headers = [brand.name, ...columns.slice(1)];

  return (
    <div className="mx-auto mt-20 max-w-5xl px-4 sm:mt-28 sm:px-6">
      <SectionHeading align="center">
        {brand.pdp.comparisonHeadline}
      </SectionHeading>
      <div className="mt-10">
        <Table className="min-w-[34rem] border-collapse text-sm sm:text-base">
          <TableHeader className="[&_tr]:border-b-0">
            <TableRow className="hover:bg-transparent">
              <TableHead scope="col" className="sr-only">
                Feature
              </TableHead>
              {headers.map((h, i) => (
                <TableHead
                  key={h}
                  scope="col"
                  className={cn(
                    "h-auto px-3 py-4 text-center font-heading font-extrabold whitespace-normal",
                    i === 0 &&
                      "rounded-t-lg bg-primary text-primary-foreground",
                  )}
                >
                  {h}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.label}>
                <TableHead
                  scope="row"
                  className="h-auto py-4 ps-0 pe-4 text-start font-semibold whitespace-normal"
                >
                  {row.label}
                </TableHead>
                {row.values.map((v, i) => (
                  <TableCell
                    key={i}
                    className={cn(
                      "px-3 py-4 text-center whitespace-normal",
                      i === 0 && "bg-primary/10 font-semibold",
                    )}
                  >
                    <span className="inline-flex items-center gap-1.5">
                      {i === 0 ? (
                        <CheckIcon
                          aria-hidden
                          className="size-4 shrink-0 text-highlight"
                          strokeWidth={3}
                        />
                      ) : null}
                      {v}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">
        Criteria chosen by us. Camera details are as listed for the reference
        camera and still to be confirmed.
      </p>
    </div>
  );
}
