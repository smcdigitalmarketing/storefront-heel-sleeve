import { Link } from "react-router";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { storePaths } from "~/components/store/nav";
import { PageTitle } from "~/components/store/PageTitle";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { brand } from "~/content/brand";
import { faqCategories } from "~/content/store-pages";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/faq";

export function meta({ matches }: Route.MetaArgs) {
  return [
    {
      title: formatPageTitle("FAQ", getShopNameFromRootMatch(matches[0])),
    },
    {
      name: "description",
      content: `Answers about ${brand.productName}, orders, shipping and returns.`,
    },
  ];
}

export default function Faq() {
  return (
    <main className="flex-1 pb-24" id="main-content" tabIndex={-1}>
      <PageTitle eyebrow="Help" title={brand.pdp.faqHeadline} />
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 px-4 sm:px-6 lg:grid-cols-[14rem_1fr]">
        <nav
          aria-label="FAQ topics"
          className="min-w-0 lg:sticky lg:top-24 lg:self-start"
        >
          <ul
            role="list"
            className="-mx-4 flex gap-2 overflow-x-auto px-4 [scrollbar-width:none] lg:mx-0 lg:flex-col lg:px-0"
          >
            {faqCategories.map((category) => (
              <li key={category.id} className="shrink-0">
                <Button
                  asChild
                  variant="ghost"
                  className="h-11 justify-start rounded-full px-3 font-normal"
                >
                  <a href={`#${category.id}`}>{category.title}</a>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="space-y-12">
          {faqCategories.map((category, i) => (
            <section
              key={category.id}
              id={category.id}
              aria-labelledby={`${category.id}-heading`}
              className="scroll-mt-24"
            >
              <h2
                id={`${category.id}-heading`}
                className="font-heading mb-3 text-2xl font-extrabold"
              >
                {category.title}
              </h2>
              <Accordion
                type="multiple"
                defaultValue={
                  i === 0 && category.items[0] ? [category.items[0].q] : []
                }
              >
                {category.items.map((item) => (
                  <AccordionItem
                    key={item.q}
                    value={item.q}
                    className="border-foreground/20 border-b"
                  >
                    <AccordionTrigger className="**:data-[slot=accordion-trigger-icon]:text-foreground py-4 text-base hover:no-underline">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground pb-5 text-[0.95rem] leading-relaxed">
                      <p>
                        {item.a}{" "}
                        {item.status === "tbc" ? (
                          <PlaceholderTag kind="tbc" />
                        ) : null}
                        {item.status === "placeholder" ? (
                          <PlaceholderTag kind="placeholder" />
                        ) : null}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>
          ))}
          <p className="text-muted-foreground">
            Still stuck?{" "}
            <Link
              to={storePaths.contact}
              className="text-foreground underline underline-offset-4"
            >
              Contact us
            </Link>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
