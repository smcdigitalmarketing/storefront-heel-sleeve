// The advertorial, ported from the mock's components/advertorial/Advertorial.tsx
// (Rally's field-notes zine only). It stays marked "Brand content", carries
// no health claims, and its calls to action go to the Rally sleeve page.

import { ArrowRightIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

import { Divider } from "~/components/brand/Divider";
import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { scoreLabel } from "~/components/brand/score-label";
import { featureIcons } from "~/components/pdp/icons";
import { brand } from "~/content/brand";
import type { AdvertorialSection } from "~/content/types";
import { cn } from "~/lib/utils";

import { BrandLinkButton } from "./BrandButton";
import { PRODUCT_PATH, storePaths } from "./nav";

const UPDATED = "23 October 2026";

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
        className={cn(
          scoreLabel,
          "border border-current px-1.5 py-0.5 text-[10px] opacity-80",
        )}
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

/** The natural product introduction, placed before section 5. */
function MeetTheSleeve() {
  return (
    <aside
      aria-label={brand.productName}
      className="border-foreground bg-card text-card-foreground mb-10 grid items-center gap-6 border-2 p-6 sm:grid-cols-[12rem_1fr] sm:p-8"
    >
      <Img
        image="product-studio"
        sizes="12rem"
        className="aspect-square w-full object-cover"
      />
      <div className="space-y-3">
        <p className={cn(scoreLabel, "text-highlight")}>Meet the sleeve</p>
        <h3 className="font-heading text-2xl font-bold uppercase">
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
        className="aspect-[4/5] w-full object-cover"
      />
      {section.caption ? (
        <figcaption className="px-2 py-2 text-xs opacity-70">
          {section.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

const frameLabel = (i: number) => `#${String(i + 1).padStart(2, "0")}`;

/** Rally's field-notes zine: a Night header, a contents list and ruled frames. */
export function AdvertorialArticle() {
  const a = brand.advertorial;
  const total = String(a.sections.length).padStart(2, "0");
  return (
    <article data-testid="advertorial">
      <header className="bg-secondary text-secondary-foreground">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:items-end lg:py-16">
          <div>
            <p className={cn(scoreLabel, "text-accent")}>{a.kicker}</p>
            <h1 className="font-heading mt-5 text-[2.4rem] leading-[0.95] font-bold tracking-[-0.035em] text-balance uppercase sm:text-6xl">
              {a.headline}
            </h1>
            <p className="mt-5 text-lg opacity-80">{a.dek}</p>
            <Byline className="mt-6 opacity-80" />
          </div>
          <figure className="border-accent border-2">
            <Img
              image={a.leadImage}
              sizes="(min-width: 1024px) 45vw, 100vw"
              priority
              className="aspect-[4/5] w-full object-cover"
            />
            <figcaption
              className={cn(
                scoreLabel,
                "bg-accent text-accent-foreground px-3 py-1.5",
              )}
            >
              {a.leadCaption}
            </figcaption>
          </figure>
        </div>
        <Divider />
      </header>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[13rem_1fr] lg:py-16">
        <nav
          aria-label="Frames in this issue"
          className="lg:sticky lg:top-22 lg:self-start"
        >
          <p className={cn(scoreLabel, "text-muted-foreground mb-3")}>
            Contents
          </p>
          <ol className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-sm lg:grid-cols-1">
            {a.sections.map((section, i) => (
              <li key={section.title}>
                <a
                  href={`#frame-${i + 1}`}
                  className="flex min-h-11 items-center gap-2 hover:underline lg:min-h-0"
                >
                  <span className={cn(scoreLabel, "text-highlight shrink-0")}>
                    {frameLabel(i)}
                  </span>
                  <span className="truncate">{section.title}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
        <div className="min-w-0">
          <div className="max-w-2xl space-y-4 text-lg leading-relaxed">
            {a.intro.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <ol className="border-foreground mt-12 border-t-2">
            {a.sections.map((section, i) => (
              <li
                key={section.title}
                id={`frame-${i + 1}`}
                className="border-foreground scroll-mt-22 border-b-2 py-10"
              >
                {i === 4 ? <MeetTheSleeve /> : null}
                <div className="grid gap-6 md:grid-cols-[1fr_16rem]">
                  <div>
                    <p className={cn(scoreLabel, "text-highlight")}>
                      {frameLabel(i)} / {total}
                    </p>
                    <h2 className="font-heading mt-2 text-3xl leading-none font-bold tracking-[-0.03em] uppercase sm:text-4xl">
                      {section.title}
                    </h2>
                    <div className="text-foreground/85 mt-4 space-y-3 leading-relaxed">
                      {section.body.map((p) => (
                        <p key={p}>{p}</p>
                      ))}
                      {section.placeholder ? (
                        <PlaceholderTag
                          kind="placeholder"
                          label={section.placeholder}
                        />
                      ) : null}
                    </div>
                    {section.cta ? (
                      <Link
                        to={storePaths.how}
                        className="font-heading decoration-primary mt-5 inline-flex min-h-11 items-center gap-2 font-bold uppercase underline decoration-2 underline-offset-4"
                      >
                        {section.cta}{" "}
                        <ArrowRightIcon className="size-4" aria-hidden="true" />
                      </Link>
                    ) : null}
                  </div>
                  <SectionImage
                    section={section}
                    className="border-foreground bg-card self-start border-2"
                  />
                </div>
              </li>
            ))}
          </ol>
          <Closing />
        </div>
      </div>
    </article>
  );
}

function Closing() {
  const { closing } = brand.advertorial;
  return (
    <section
      aria-label="Shop the sleeve"
      className="bg-secondary text-secondary-foreground mt-16 p-8 text-center sm:p-12"
    >
      <h2 className="font-heading text-3xl font-bold text-balance uppercase sm:text-4xl">
        {closing.headline}
      </h2>
      <p className="mx-auto mt-4 max-w-xl opacity-85">{closing.body}</p>
      <CtaButton className="mt-8">{closing.cta}</CtaButton>
      <div className="mt-6 flex justify-center">
        <PlaceholderTag
          kind="placeholder"
          label="Concept copy · no claims beyond listed specs"
        />
      </div>
    </section>
  );
}
