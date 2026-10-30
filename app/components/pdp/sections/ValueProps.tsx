import { CheckIcon } from "lucide-react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import { scoreLabel } from "~/components/brand/score-label";
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
          <Numbered />
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

/**
 * Rally's value props: a scoreboard list with a big numeral, the benefit and
 * a photo tagged with its number, between 2px Night rules.
 */
function Numbered() {
  return (
    <ol className="border-t-2 border-foreground">
      {brand.pdp.valueProps.map((vp, i) => {
        const number = String(i + 1).padStart(2, "0");
        return (
          <li
            key={vp.headline}
            className="grid gap-5 border-b-2 border-foreground py-6 sm:grid-cols-[5rem_1fr_16rem] sm:items-center sm:gap-8 sm:py-8"
          >
            <span
              aria-hidden
              className="font-heading text-5xl leading-none font-extrabold text-highlight italic tabular-nums"
            >
              {number}
            </span>
            <div className="space-y-2">
              <h3 className="font-heading text-2xl leading-none font-extrabold tracking-[-0.01em] uppercase italic sm:text-3xl">
                {vp.headline}
              </h3>
              <p className="max-w-xl text-muted-foreground">{vp.body}</p>
            </div>
            <div className="relative">
              <Img
                image={vp.image}
                sizes="(min-width: 640px) 16rem, 100vw"
                className="aspect-[3/2] w-full object-cover"
              />
              <span
                aria-hidden
                className={cn(
                  scoreLabel,
                  "absolute bottom-0 left-0 bg-secondary px-2 py-1 text-[10px] text-accent",
                )}
              >
                #{number}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function HowItWorks() {
  return (
    <div
      id="how-it-works"
      className="mx-auto mt-20 max-w-7xl scroll-mt-4 px-4 sm:mt-28 sm:px-6"
    >
      <SectionHeading eyebrow={`${product.howItWorks.length} steps`}>
        {brand.pdp.howItWorksHeadline}
      </SectionHeading>
      <ol className="mt-10 grid gap-6 sm:grid-cols-3">
        {product.howItWorks.map((step, i) => (
          <li
            key={step.title}
            className="border-2 border-foreground bg-card text-card-foreground"
          >
            <Img
              image={step.image}
              sizes="(min-width: 640px) 33vw, 100vw"
              className="aspect-square w-full object-cover"
            />
            <div className="space-y-1 p-4">
              <p className={cn(scoreLabel, "text-highlight")}>
                Step {String(i + 1).padStart(2, "0")}
              </p>
              <h3 className="font-heading text-xl font-extrabold uppercase italic">
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

/** Listed specs on a lime band. */
function StatsBand() {
  return (
    <div className="mt-20 bg-primary text-primary-foreground sm:mt-28">
      <dl className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 px-4 py-12 sm:px-6 lg:grid-cols-4">
        {product.stats.map((stat) => (
          <div key={stat.label} className="px-2">
            <dt className="sr-only">{stat.label}</dt>
            <dd className="font-heading text-5xl leading-none font-extrabold italic tabular-nums sm:text-6xl">
              {stat.value}
            </dd>
            <dd className={cn(scoreLabel, "mt-2")}>{stat.label}</dd>
          </div>
        ))}
      </dl>
      <p className="mx-auto max-w-7xl px-4 pb-6 sm:px-6">
        <PlaceholderTag
          kind="listed"
          label="Specs as listed by the competitor, to be confirmed"
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
        <Table className="min-w-[34rem] border-collapse border-2 border-foreground text-sm sm:text-base">
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
                    "h-auto px-3 py-4 text-center whitespace-normal",
                    scoreLabel,
                    i === 0 && "bg-primary text-primary-foreground",
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
                  className="h-auto py-4 ps-3 pe-4 text-start font-semibold whitespace-normal"
                >
                  {row.label}
                </TableHead>
                {row.values.map((v, i) => (
                  <TableCell
                    key={i}
                    className={cn(
                      "px-3 py-4 text-center whitespace-normal",
                      i === 0 && "bg-primary/15 font-semibold",
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
        Criteria chosen by us and checkable on the product. Sleeve details are
        as listed by the competitor and still to be confirmed.
      </p>
    </div>
  );
}
