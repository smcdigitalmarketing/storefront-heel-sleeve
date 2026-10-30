import { PauseIcon, PlayIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { SizeGuideButton, SizeTable } from "~/components/store/SizeGuide";
import { brand } from "~/content/brand";
import { SIZE_SOURCE } from "~/content/catalog";
import { stripImages, type ImageId } from "~/content/images";
import { product } from "~/content/product";
import { proof } from "~/content/proof";
import type { ContentStatus } from "~/content/types";
import { cn } from "~/lib/utils";

import { ProductDescription } from "../blocks/ProductDescription";

/**
 * SOP section 4: the long description and an at-a-glance spec box, then the
 * accordion. Accordions get 1–2% engagement, so the first one is open and
 * carries the main selling points; the description sits outside it so it is
 * always read. Then an auto-scrolling lifestyle strip.
 */
export function Details() {
  const items: { value: string; title: string; body: ReactNode }[] = [
    {
      value: "love",
      title: "Why you'll love it",
      body: (
        <ul className="space-y-3">
          {brand.pdp.whyLove.map((item) => (
            <li key={item.title} className="flex gap-3">
              <span
                aria-hidden
                className="shrink-0 font-heading font-bold text-highlight"
              >
                ✦
              </span>
              <span>
                <span className="block font-semibold">{item.title}</span>
                <span className="text-muted-foreground">{item.body}</span>
              </span>
            </li>
          ))}
        </ul>
      ),
    },
    {
      value: "specs",
      title: "Specs",
      body: (
        <dl className="divide-y divide-border/40">
          {Object.values(product.facts).map((fact) => (
            <div
              key={fact.label}
              className="grid grid-cols-[8rem_1fr] gap-3 py-2 sm:grid-cols-[10rem_1fr]"
            >
              <dt className="text-muted-foreground">{fact.label}</dt>
              <dd className="flex flex-wrap items-center gap-2">
                {fact.value}
                <StatusTag status={fact.status} />
              </dd>
            </div>
          ))}
        </dl>
      ),
    },
    {
      value: "box",
      title: "What's in the box",
      body: (
        <ul className="space-y-1.5">
          {product.included.map((item) => (
            <li key={item.name}>
              <span className="font-semibold">{item.name}</span>{" "}
              <span className="text-muted-foreground">({item.detail})</span>
            </li>
          ))}
          <li className="pt-2">
            <PlaceholderTag
              kind="listed"
              label="Contents as listed by competitor · packaging not yet seen"
            />
          </li>
        </ul>
      ),
    },
    {
      value: "materials",
      title: "Materials and care",
      body: (
        <div className="space-y-4">
          <dl className="divide-y divide-border/40">
            {product.materials.map((fact) => (
              <div
                key={fact.label}
                className="grid grid-cols-[8rem_1fr] gap-3 py-2 sm:grid-cols-[10rem_1fr]"
              >
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="flex flex-wrap items-center gap-2">
                  {fact.value}
                  <StatusTag status={fact.status} />
                </dd>
              </div>
            ))}
          </dl>
          <ul className="list-disc space-y-1.5 ps-5">
            {product.care.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      ),
    },
    {
      value: "sizing",
      title: "Sizing and fit",
      body: (
        <div className="space-y-4">
          <SizeTable />
          <ul className="list-disc space-y-1.5 ps-5">
            {product.fitTips.map((tip) => (
              <li key={tip}>{tip}</li>
            ))}
          </ul>
          <div className="flex flex-wrap items-center gap-3">
            <SizeGuideButton />
            <PlaceholderTag kind="listed" label={SIZE_SOURCE} />
          </div>
        </div>
      ),
    },
    {
      value: "shipping",
      title: "Shipping & returns",
      body: (
        <div className="grid gap-2">
          {Object.values(product.policies).map((p) => (
            <p key={p.title}>
              <span className="font-semibold">{p.title}:</span> {p.body}{" "}
              <PlaceholderTag kind="tbc" />
            </p>
          ))}
        </div>
      ),
    },
    {
      value: "guarantee",
      title: "Guarantee and warranty",
      body: (
        <div className="grid justify-items-start gap-3">
          <p>
            <span className="font-semibold">{proof.guarantee.title}.</span>{" "}
            {proof.guarantee.body}
          </p>
          <ol className="list-decimal space-y-1 ps-5">
            {proof.guarantee.steps.map((step) => (
              <li key={step.title}>
                <span className="font-semibold">{step.title}:</span> {step.body}
              </li>
            ))}
          </ol>
          <p>
            <span className="font-semibold">{proof.warranty.title}.</span>{" "}
            {proof.warranty.body}
          </p>
          <PlaceholderTag kind="tbc" label="Proposed terms" />
        </div>
      ),
    },
  ];

  const { facts } = product;
  const glance = [
    facts.type,
    facts.strap,
    facts.sizes,
    facts.colours,
    facts.material,
    facts.care,
  ];

  return (
    <section
      data-sop-section="details"
      aria-labelledby="details-heading"
      className="py-14 sm:py-20"
    >
      <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="space-y-8">
          <SectionHeading id="details-heading" eyebrow={brand.productName}>
            The details
          </SectionHeading>
          <ProductDescription facts={glance} />
        </div>
        <Accordion type="multiple" defaultValue={["love"]}>
          {items.map((item) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="mb-3 rounded-lg border-2 bg-card px-4 text-card-foreground not-last:border-b-2"
            >
              <AccordionTrigger className="py-4 font-heading text-lg font-extrabold hover:no-underline **:data-[slot=accordion-trigger-icon]:text-card-foreground">
                {item.title}
              </AccordionTrigger>
              {/* Spacing comes from each body's own stack, not the content's paragraph margins. */}
              <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed [&_p:not(:last-child)]:mb-0">
                {item.body}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
      <LifestyleStrip />
    </section>
  );
}

function StatusTag({ status }: { status: ContentStatus }) {
  if (status === "confirmed") return null;
  return (
    <PlaceholderTag kind={status === "competitor-listed" ? "listed" : "tbc"} />
  );
}

/** Sample photos off the reference camera, scrolling past like a contact strip. */
function LifestyleStrip() {
  const [paused, setPaused] = useState(false);
  const frames = [...stripImages, ...stripImages];

  return (
    <div className="mt-14 sm:mt-20">
      <div className="mx-auto mb-5 flex max-w-7xl flex-wrap items-center gap-3 px-4 sm:px-6">
        <h3 className="font-heading text-xl font-extrabold">
          {brand.pdp.stripHeadline}
        </h3>
        <PlaceholderTag
          kind="competitor"
          label="Sample photos from the reference camera (competitor)"
        />
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          className="ms-auto h-11 rounded-full border-foreground/30 px-4 text-xs motion-reduce:hidden"
        >
          {paused ? (
            <PlayIcon aria-hidden className="size-3.5" />
          ) : (
            <PauseIcon aria-hidden className="size-3.5" />
          )}
          {paused ? "Play" : "Pause"} strip
        </Button>
      </div>
      <div
        className="overflow-hidden motion-reduce:overflow-x-auto"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <ul
          data-paused={paused}
          className="flex w-max gap-3 motion-safe:animate-marquee motion-safe:[animation-duration:80s] data-[paused=true]:paused sm:gap-4"
        >
          {frames.map((image, i) => (
            <li
              key={`${image.id}-${i}`}
              aria-hidden={i >= stripImages.length}
              className={cn(
                "my-4 shrink-0 bg-card p-2 pb-7 shadow-xl",
                i % 2 ? "rotate-2" : "-rotate-2",
              )}
            >
              <Img
                image={image.id as ImageId}
                sizes="320px"
                alt={i >= stripImages.length ? "" : image.alt}
                className="h-40 w-auto object-cover sm:h-56"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
