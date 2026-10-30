import { Link } from "react-router";

import { Img } from "~/components/brand/Img";
import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { brand } from "~/content/brand";
import { guideArticle, guideSteps } from "~/content/store-pages";

import { SizeTable } from "./SizeGuide";

import { BrandLinkButton } from "./BrandButton";
import { PRODUCT_PATH, storePaths } from "./nav";

/** The size and fit guide (the mock's article route, Guide). */
export function GuideArticle() {
  return (
    <article
      data-testid="guide-article"
      className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16"
    >
      <Link
        to={storePaths.journal}
        className="text-muted-foreground inline-flex min-h-11 items-center text-sm hover:underline"
      >
        ← {brand.store.nav.journal}
      </Link>
      <p className="text-muted-foreground mt-6 text-sm">
        {guideArticle.kicker} · {guideArticle.readTime}
      </p>
      <h1 className="font-heading mt-3 text-4xl font-extrabold tracking-[-0.03em] text-balance sm:text-6xl">
        {guideArticle.headline}
      </h1>
      <p className="text-muted-foreground mt-4 text-xl">{guideArticle.dek}</p>
      <Img
        image={guideArticle.image}
        priority
        sizes="(min-width: 768px) 720px, 100vw"
        className="mt-8 aspect-[4/3] w-full rounded-3xl object-cover"
      />
      <ol className="mt-10 space-y-8">
        {guideSteps.map((step, i) => (
          <li key={step.title} className="grid grid-cols-[3rem_1fr] gap-4">
            <span className="bg-secondary font-heading text-secondary-foreground flex size-12 items-center justify-center rounded-full text-xl font-bold">
              {i + 1}
            </span>
            <div className="space-y-1 pt-2">
              <h2 className="text-xl font-semibold">{step.title}</h2>
              <p className="text-muted-foreground text-lg">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <SizeTable className="mt-10" />
      <p className="mt-8">
        <PlaceholderTag
          kind="listed"
          label="Sizes as listed by the competitor · confirm with supplier"
        />
      </p>
      <div className="mt-12 flex flex-wrap gap-3">
        <BrandLinkButton to={PRODUCT_PATH}>
          {brand.store.products.sleeve.name}
        </BrandLinkButton>
      </div>
    </article>
  );
}
