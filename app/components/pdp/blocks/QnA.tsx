import { MessageCircleQuestionIcon } from "lucide-react";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { SectionHeading } from "~/components/brand/SectionHeading";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { brand } from "~/content/brand";
import { proof } from "~/content/proof";
import { formatReviewDate } from "~/content/reviews";

/** Customer questions with the brand's answers. The first three are open. */
export function QnA() {
  return (
    <div
      data-block="qna"
      data-proof="qna"
      className="mx-auto max-w-3xl px-4 pt-16 sm:px-6 sm:pt-24"
    >
      <SectionHeading align="center" eyebrow={`${proof.qna.length} questions`}>
        {brand.pdp.qnaHeadline}
      </SectionHeading>
      <div className="mt-4 flex justify-center">
        <PlaceholderTag
          kind="placeholder"
          label="Illustrative customer questions"
        />
      </div>
      <Accordion
        type="multiple"
        defaultValue={proof.qna.slice(0, 3).map((q) => q.q)}
        className="mt-8"
      >
        {proof.qna.map((item) => (
          <AccordionItem
            key={item.q}
            value={item.q}
            className="mb-3 rounded-lg border-2 bg-card px-4 text-card-foreground not-last:border-b-2"
          >
            <AccordionTrigger className="py-4 font-heading text-base font-bold text-card-foreground hover:no-underline **:data-[slot=accordion-trigger-icon]:text-card-foreground">
              <span className="flex gap-3">
                <MessageCircleQuestionIcon
                  aria-hidden
                  className="mt-0.5 size-5 shrink-0"
                />
                <span>
                  {item.q}
                  <span className="block text-xs font-normal text-muted-foreground">
                    Asked by {item.asker} ·{" "}
                    <time dateTime={item.date}>
                      {formatReviewDate(item.date)}
                    </time>
                  </span>
                </span>
              </span>
            </AccordionTrigger>
            <AccordionContent className="ps-8 pb-5 text-[0.95rem] leading-relaxed [&_p:not(:last-child)]:mb-1">
              <p className="mb-1 text-xs font-semibold">
                Answer from the {brand.name} team
              </p>
              <p className="text-muted-foreground">
                {item.a}{" "}
                {"status" in item && item.status === "tbc" ? (
                  <PlaceholderTag kind="tbc" />
                ) : null}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
