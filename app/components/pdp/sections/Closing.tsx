import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import { ReviewCard } from "~/components/proof/ReviewCard";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { brand } from "~/content/brand";
import { product } from "~/content/product";
import { closingReviews as stories } from "~/content/reviews";
import type { FaqItem } from "~/content/types";

import { FinalCta } from "../blocks/FinalCta";
import { GuaranteeBlock } from "../blocks/GuaranteeBlock";
import { QnA } from "../blocks/QnA";

/**
 * SOP section 7, in order: the guarantee and how to claim it, final stories,
 * customer questions, the FAQ grouped by topic, a last call to action, then
 * the store footer. The guarantee terms are proposed, and labelled.
 */
export function Closing() {
  const groups = groupFaq(product.faq);

  return (
    <section data-sop-section="closing" aria-labelledby="closing-heading">
      <div className="mx-auto max-w-7xl px-4 pt-16 sm:px-6 sm:pt-24">
        <SectionHeading id="closing-heading" align="center">
          {brand.pdp.closingHeadline}
        </SectionHeading>

        <GuaranteeBlock />

        <ul className="mx-auto mt-14 grid max-w-6xl gap-6 md:grid-cols-2 lg:grid-cols-3">
          {stories.map((review, i) => (
            <li key={review.id} className="flex">
              <ReviewCard review={review} index={i} className="flex-1" />
            </li>
          ))}
        </ul>
      </div>

      <QnA />

      <div
        id="faq"
        className="mx-auto max-w-3xl scroll-mt-4 px-4 py-16 sm:px-6 sm:py-24"
      >
        <SectionHeading align="center">{brand.pdp.faqHeadline}</SectionHeading>
        {groups.map(([category, items]) => (
          <div key={category} className="mt-10">
            {/* Tomato is for large text only, so the category label uses Cobalt. */}
            <h3 className="mb-2 font-heading text-base font-extrabold text-primary">
              {category}
            </h3>
            <Accordion type="single" collapsible>
              {items.map((item) => (
                <AccordionItem
                  key={item.q}
                  value={item.q}
                  className="border-b border-foreground/20"
                >
                  <AccordionTrigger className="py-5 font-heading text-lg font-bold text-foreground hover:no-underline **:data-[slot=accordion-trigger-icon]:text-foreground">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="pb-5 text-[0.95rem] leading-relaxed text-muted-foreground">
                    <p>
                      {item.a} <FaqTag status={item.status} />
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        ))}
      </div>

      <FinalCta />
    </section>
  );
}

function FaqTag({ status }: { status?: FaqItem["status"] }) {
  if (status === "tbc") return <PlaceholderTag kind="tbc" />;
  if (status === "competitor-listed") return <PlaceholderTag kind="listed" />;
  return null;
}

/** FAQ items grouped by category, in first-seen order. */
function groupFaq(items: readonly FaqItem[]) {
  const groups = new Map<string, FaqItem[]>();
  for (const item of items) {
    const key = item.category ?? "Questions";
    groups.set(key, [...(groups.get(key) ?? []), item]);
  }
  return [...groups];
}
