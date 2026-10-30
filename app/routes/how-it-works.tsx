import { Link } from "react-router";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { BrandLinkButton } from "~/components/store/BrandButton";
import { PRODUCT_PATH, storePaths } from "~/components/store/nav";
import { PageTitle } from "~/components/store/PageTitle";
import { brand } from "~/content/brand";
import { SizeGuideButton } from "~/components/store/SizeGuide";
import { HEEL_NOTE, product } from "~/content/product";
import { guideSteps } from "~/content/store-pages";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/how-it-works";

export function meta({ matches }: Route.MetaArgs) {
  return [
    {
      title: formatPageTitle(
        brand.store.nav.how,
        getShopNameFromRootMatch(matches[0]),
      ),
    },
    { name: "description", content: brand.pdp.subheadline },
  ];
}

const HEADING = "font-heading text-3xl font-extrabold sm:text-4xl";

export default function HowItWorks() {
  return (
    <main className="flex-1 pb-24" id="main-content" tabIndex={-1}>
      <PageTitle
        eyebrow={brand.store.nav.how}
        title={brand.pdp.gallery.howItWorks.headline}
        intro={brand.pdp.subheadline}
      />
      <div className="mx-auto max-w-7xl space-y-24 px-4 sm:px-6">
        <ol className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {product.howItWorks.map((step, i) => (
            <li
              key={step.title}
              className="bg-card text-card-foreground rounded-3xl border-2 p-3"
            >
              <Img
                image={step.image}
                sizes="(min-width: 1024px) 25vw, 50vw"
                className="aspect-square w-full rounded-lg object-cover"
              />
              <div className="space-y-1 pt-4">
                <p className="text-muted-foreground text-sm">Step {i + 1}</p>
                <h2 className="font-heading text-2xl font-bold">
                  {step.title}
                </h2>
                <p className="text-muted-foreground">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <section
          aria-labelledby="strap-heading"
          className="grid items-center gap-10 md:grid-cols-2"
        >
          <Img
            image="step-strap"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="aspect-square w-full rounded-3xl object-cover"
          />
          <div className="space-y-4">
            <h2 id="strap-heading" className={HEADING}>
              The strap, explained
            </h2>
            <p className="text-muted-foreground text-lg">
              One hook-and-loop strap crosses over the top of the foot and wraps
              behind the heel in a figure-8. Pull it snug, not tight, and loosen
              it if your child feels tingling or it leaves deep marks.
            </p>
            <p className="border-l-2 pl-4">{HEEL_NOTE}</p>
            <PlaceholderTag
              kind="listed"
              label="Strap design as listed by the competitor"
            />
          </div>
        </section>

        <section aria-labelledby="sizing-heading" className="space-y-8">
          <div className="flex flex-wrap items-baseline justify-between gap-4">
            <h2 id="sizing-heading" className={HEADING}>
              Sizing in four steps
            </h2>
            <SizeGuideButton />
          </div>
          <ol className="grid gap-4 md:grid-cols-4">
            {guideSteps.map((step, i) => (
              <li
                key={step.title}
                className="bg-secondary text-secondary-foreground space-y-2 rounded-3xl p-5"
              >
                <span className="font-heading text-primary text-4xl font-bold">
                  {i + 1}
                </span>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p>{step.body}</p>
              </li>
            ))}
          </ol>
          <p className="flex flex-wrap items-center gap-3 text-sm">
            <Link
              to={storePaths.guide}
              className="inline-flex min-h-11 items-center underline underline-offset-4"
            >
              Read the full sizing guide
            </Link>
            <PlaceholderTag
              kind="listed"
              label="Sizes as listed by the competitor · confirm with supplier"
            />
          </p>
        </section>

        <section aria-labelledby="specs-heading" className="mx-auto max-w-3xl">
          <h2 id="specs-heading" className={`${HEADING} mb-6`}>
            Specs
          </h2>
          <dl className="divide-foreground/20 border-foreground/20 divide-y border-y">
            {Object.values(product.facts).map((fact) => (
              <div
                key={fact.label}
                className="grid gap-1 py-3 sm:grid-cols-[12rem_1fr]"
              >
                <dt className="text-muted-foreground">{fact.label}</dt>
                <dd className="flex flex-wrap items-center gap-2">
                  {fact.value}
                  <PlaceholderTag
                    kind={fact.status === "tbc" ? "tbc" : "listed"}
                  />
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <div className="flex justify-center">
          <BrandLinkButton to={PRODUCT_PATH} size="lg">
            {brand.compare.cta}
          </BrandLinkButton>
        </div>
      </div>
    </main>
  );
}
