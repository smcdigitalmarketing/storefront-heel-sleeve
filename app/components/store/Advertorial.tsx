// The advertorial, ported from the mock's components/advertorial/Advertorial.tsx
// (Flashpop's numbered listicle only). It stays marked "Brand content" and its
// calls to action go to the Flashpop One page.

import { ArrowRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { featureIcons } from "~/components/pdp/icons";
import { brand } from "~/content/brand";
import type { AdvertorialSection } from "~/content/types";
import { cn } from "~/lib/utils";

import { BrandLinkButton } from "./BrandButton";
import { PRODUCT_PATH, storePaths } from "./nav";

const UPDATED = "23 October 2026";

/** Flashpop's white print frame (the mock's fp-print). */
const PRINT = "bg-card p-2 pb-7 shadow-xl";

function Byline({ className }: { className?: string }) {
  const a = brand.advertorial;
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-3 gap-y-2 text-sm",
        className,
      )}
    >
      <span className="font-semibold">{a.byline}</span>
      <span aria-hidden="true">·</span>
      <span>Updated {UPDATED}</span>
      <span aria-hidden="true">·</span>
      <span>{a.readTime}</span>
      <span
        data-testid="brand-content"
        className="rounded-sm border border-current px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase opacity-80"
      >
        Brand content
      </span>
    </div>
  );
}

function CtaButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <BrandLinkButton to={PRODUCT_PATH} size="lg" className={className}>
      {children}
      <ArrowRightIcon className="size-4" aria-hidden="true" />
    </BrandLinkButton>
  );
}

/** The natural product introduction, placed mid-article. */
function MeetTheCamera() {
  return (
    <aside
      aria-label={brand.productName}
      className="bg-secondary text-secondary-foreground my-14 grid items-center gap-6 rounded-3xl border-2 p-6 sm:grid-cols-[12rem_1fr] sm:p-8"
    >
      <Img
        image="product-studio"
        sizes="12rem"
        className="aspect-square w-full rounded-lg object-cover"
      />
      <div className="space-y-3">
        <p className="font-heading text-xs font-bold">Meet the camera</p>
        <h3 className="font-heading text-2xl font-extrabold">
          {brand.productName}
        </h3>
        <ul role="list" className="space-y-1.5 text-sm">
          {brand.pdp.bullets.map((bullet) => {
            const Icon = featureIcons[bullet.icon];
            return (
              <li key={bullet.text} className="flex items-center gap-2">
                <Icon className="size-4 shrink-0" aria-hidden="true" />
                {bullet.text}
              </li>
            );
          })}
        </ul>
        <CtaButton className="mt-2">See {brand.productName}</CtaButton>
      </div>
    </aside>
  );
}

function SectionImage({
  section,
  className,
}: {
  section: AdvertorialSection;
  className?: string;
}) {
  if (!section.image) return null;
  return (
    <figure className={className}>
      <Img
        image={section.image}
        sizes="(min-width: 768px) 720px, 100vw"
        className="aspect-[4/3] w-full object-cover"
      />
      {section.caption ? (
        <figcaption className="mt-2 text-xs opacity-70">
          {section.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

/** Flashpop's punchy numbered listicle. */
export function AdvertorialArticle() {
  const a = brand.advertorial;
  return (
    <article
      data-testid="advertorial"
      className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-14"
    >
      <p className="bg-highlight font-heading text-highlight-foreground inline-block -rotate-2 rounded-full px-3 py-1 text-sm font-bold">
        {a.kicker}
      </p>
      <h1 className="font-heading mt-5 text-[2.6rem] leading-[0.92] font-extrabold tracking-[-0.035em] text-balance sm:text-7xl">
        {a.headline}
      </h1>
      <p className="text-muted-foreground mt-5 text-xl">{a.dek}</p>
      <Byline className="text-muted-foreground mt-6" />
      <figure className="mt-8">
        <div className={cn(PRINT, "-rotate-1")}>
          <Img
            image={a.leadImage}
            sizes="(min-width: 768px) 720px, 100vw"
            priority
            className="aspect-[4/3] w-full object-cover"
          />
        </div>
        <figcaption className="font-heading mt-4 text-center font-bold">
          {a.leadCaption}
        </figcaption>
      </figure>
      <div className="mt-10 space-y-4 text-lg leading-relaxed">
        {a.intro.map((p) => (
          <p key={p}>{p}</p>
        ))}
      </div>

      <ol className="mt-12 space-y-16">
        {a.sections.map((section, i) => (
          <li key={section.title}>
            {i === 3 ? <MeetTheCamera /> : null}
            <div className="flex items-start gap-4">
              <span className="bg-secondary text-primary font-heading flex size-14 shrink-0 items-center justify-center text-2xl font-extrabold tabular-nums sm:size-16 sm:text-3xl">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h2 className="font-heading pt-3 text-3xl leading-[0.95] font-extrabold tracking-[-0.02em] sm:text-4xl">
                {section.title}
              </h2>
            </div>
            <div className="mt-5 space-y-4 text-lg leading-relaxed">
              {section.body.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {section.image ? (
              <div
                className={cn(PRINT, "mt-6", i % 2 ? "rotate-1" : "-rotate-1")}
              >
                <SectionImage section={section} />
              </div>
            ) : null}
            {section.cta ? (
              <Link
                to={storePaths.how}
                className="font-heading text-highlight mt-5 inline-flex min-h-11 items-center gap-2 font-bold underline underline-offset-4"
              >
                {section.cta}{" "}
                <ArrowRightIcon className="size-4" aria-hidden="true" />
              </Link>
            ) : null}
          </li>
        ))}
      </ol>
      <Closing />
    </article>
  );
}

function Closing() {
  const { closing } = brand.advertorial;
  return (
    <section
      aria-label="Shop the camera"
      className="bg-primary text-primary-foreground mt-16 rounded-3xl border-2 p-8 text-center sm:p-12"
    >
      <h2 className="font-heading text-3xl font-extrabold text-balance sm:text-4xl">
        {closing.headline}
      </h2>
      <p className="mx-auto mt-4 max-w-xl opacity-85">{closing.body}</p>
      <CtaButton className="bg-secondary text-secondary-foreground hover:bg-secondary mt-8">
        {closing.cta}
      </CtaButton>
      <div className="mt-6 flex justify-center">
        <PlaceholderTag
          kind="placeholder"
          label="Concept copy · no claims beyond listed specs"
        />
      </div>
    </section>
  );
}
