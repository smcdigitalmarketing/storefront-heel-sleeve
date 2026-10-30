import { Img } from "~/components/brand/Img";
import { BrandLinkButton } from "~/components/store/BrandButton";
import { PRODUCT_PATH } from "~/components/store/nav";
import { PageTitle } from "~/components/store/PageTitle";
import { brand } from "~/content/brand";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";
import { cn } from "~/lib/utils";

import type { Route } from "./+types/about";

export function meta({ matches }: Route.MetaArgs) {
  return [
    {
      title: formatPageTitle(
        brand.store.nav.about,
        getShopNameFromRootMatch(matches[0]),
      ),
    },
    { name: "description", content: brand.store.about.intro },
  ];
}

// The three value cards: sunflower, bubblegum, tomato.
const VALUE_TONES = [
  "bg-secondary text-secondary-foreground",
  "bg-accent text-accent-foreground",
  "bg-highlight text-highlight-foreground",
];

export default function About() {
  const about = brand.store.about;
  return (
    <main className="flex-1 pb-24" id="main-content" tabIndex={-1}>
      <PageTitle
        eyebrow={brand.store.nav.about}
        title={about.headline}
        intro={about.intro}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="overflow-hidden rounded-3xl border-2">
          <Img
            image={about.image}
            priority
            sizes="(min-width: 1280px) 1216px, 100vw"
            className="aspect-[16/9] w-full object-cover motion-safe:animate-kenburns"
          />
        </div>
        <p className="mx-auto mt-14 max-w-3xl text-xl leading-relaxed sm:text-2xl">
          {brand.story}
        </p>

        <div className="mt-20 space-y-20">
          {about.sections.map((section, i) => (
            <section
              key={section.title}
              aria-labelledby={`about-section-${i}`}
              className="grid items-center gap-8 md:grid-cols-2 md:gap-16"
            >
              <Img
                image={section.image}
                sizes="(min-width: 768px) 50vw, 100vw"
                className={cn(
                  "aspect-[4/3] w-full rounded-3xl object-cover",
                  i % 2 && "md:order-2",
                )}
              />
              <div className="space-y-4">
                <h2
                  id={`about-section-${i}`}
                  className="font-heading text-3xl font-extrabold sm:text-4xl"
                >
                  {section.title}
                </h2>
                <p className="text-muted-foreground text-lg leading-relaxed">
                  {section.body}
                </p>
              </div>
            </section>
          ))}
        </div>

        <section aria-labelledby="values-heading" className="mt-24">
          <h2
            id="values-heading"
            className="font-heading mb-8 text-3xl font-extrabold"
          >
            What we stand for
          </h2>
          <ul role="list" className="grid gap-4 md:grid-cols-3">
            {about.values.map((value, i) => (
              <li
                key={value.title}
                className={cn(
                  "space-y-2 rounded-3xl border-2 p-6",
                  VALUE_TONES[i % VALUE_TONES.length],
                )}
              >
                <h3 className="font-heading text-2xl font-bold">
                  {value.title}
                </h3>
                <p>{value.body}</p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-20 flex justify-center">
          <BrandLinkButton to={PRODUCT_PATH} size="lg">
            {brand.compare.cta}
          </BrandLinkButton>
        </div>
      </div>
    </main>
  );
}
