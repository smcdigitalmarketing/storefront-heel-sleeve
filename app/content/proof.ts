// Trust and proof content shared by every concept: the rating, customer
// count, review themes, press and expert slots, guarantee, shipping promise
// and customer questions.
//
// NOTHING HERE IS REAL YET. We have no customers, ratings, press or experts.
// Every number and quote is illustrative so the concepts can be judged as a
// real store would look, and each one is shown with a dashed label (the tester
// panel can hide them). Before launch, replace:
// - rating, themes and itemRatings: with the reviews provider's live numbers
// - customers: with the real order count, or remove it
// - press and expert: with real, consenting outlets and people, or remove them
// - guarantee, shipping and warranty: with the terms Russ approves
// - qna: with questions customers actually asked

import type { ProductId } from "./catalog";
import type { ImageId } from "./images";
import type { ContentStatus } from "./types";

type Rating = {
  /** Number of 5, 4, 3, 2 and 1 star reviews, in that order. */
  distribution: [number, number, number, number, number];
  /** Percent who would recommend it to a friend. */
  recommend: number;
  status: ContentStatus;
};

function summarise(rating: Rating) {
  const count = rating.distribution.reduce((sum, n) => sum + n, 0);
  const total = rating.distribution.reduce((sum, n, i) => sum + n * (5 - i), 0);
  return { ...rating, count, average: Math.round((total / count) * 10) / 10 };
}

export const proof = {
  rating: summarise({
    distribution: [790, 94, 18, 6, 4],
    recommend: 95,
    status: "illustrative",
  }),

  customers: {
    value: "15,000+",
    label: "sports families",
    status: "illustrative" as ContentStatus,
  },

  /** Review themes, used as filter chips. Ids match Review.tags. */
  themes: [
    { id: "fit", label: "Sizing and fit" },
    { id: "comfort", label: "Comfort" },
    { id: "stays", label: "Stays put" },
    { id: "cleats", label: "Fits in cleats" },
    { id: "easy", label: "Easy to put on" },
    { id: "wear", label: "Wash and wear" },
    { id: "service", label: "Delivery and service" },
  ],

  /** Item page ratings. */
  itemRatings: {
    "game-day-kit": summarise({
      distribution: [164, 22, 4, 1, 1],
      recommend: 96,
      status: "illustrative",
    }),
    "knee-sleeve": summarise({
      distribution: [71, 14, 4, 1, 1],
      recommend: 93,
      status: "illustrative",
    }),
    "wash-bag": summarise({
      distribution: [118, 12, 3, 0, 1],
      recommend: 97,
      status: "illustrative",
    }),
    "gift-card": summarise({
      distribution: [29, 2, 0, 0, 0],
      recommend: 100,
      status: "illustrative",
    }),
  } satisfies Partial<Record<ProductId, unknown>>,

  /** Press slots. Outlet names stay placeholders: never a real publication. */
  press: [
    {
      outlet: "Outlet name (placeholder)",
      quote:
        "A simple, washable sleeve that kids actually agree to wear, with the clearest size guide we've seen.",
    },
    {
      outlet: "Outlet name (placeholder)",
      quote:
        "Slim enough for cleats and easy enough for a ten-year-old to put on alone.",
    },
    {
      outlet: "Outlet name (placeholder)",
      quote:
        "Refreshingly honest: it tells parents to see a doctor or physio first, and means it.",
    },
  ],

  /**
   * Expert slot: a youth sports coach, about wearability only. Never a
   * clinician or a health claim.
   */
  expert: {
    name: "Name to be confirmed",
    role: "Youth club soccer coach, under-9s to under-14s",
    quote:
      "With any kit, I care whether kids will actually wear it. This goes on in under a minute, sits flat under a sock and I don't see players fiddling with it at the touchline. Anything about sore heels, I send to their parents and a physio.",
    image: "adv-dad" as ImageId,
  },

  guarantee: {
    days: 30,
    title: "30-day fit guarantee",
    body: "Wrong size? We'll swap it for free. Not right for your child? Send it back within 30 days for a full refund, even if it's been worn.",
    steps: [
      {
        title: "Message us",
        body: "Reply to your order email or use the contact form within 30 days of delivery. Tell us if you'd like a new size or a refund.",
      },
      {
        title: "Send it back",
        body: "We email a prepaid return label. Wash the sleeve first, please, and fasten the strap.",
      },
      {
        title: "Swap or refund",
        body: "The new size ships as soon as the parcel is scanned, or your refund goes back to the original payment method.",
      },
    ],
    status: "tbc" as ContentStatus,
  },

  shipping: {
    /** Standard shipping is free at or over this subtotal (applied in lib/cart.ts). */
    freeOver: 50,
    dispatch: "Ships in 1–2 business days",
    tracking: "Tracked delivery, with a link in your confirmation email",
    status: "tbc" as ContentStatus,
  },

  warranty: {
    title: "6-month quality promise",
    body: "If the strap, the hook-and-loop or the seams come apart through normal use within 6 months, we'll replace the sleeve.",
    status: "tbc" as ContentStatus,
  },

  support: {
    title: "Real people on email",
    body: "Sizing questions before or after you buy: we reply within one business day.",
    status: "tbc" as ContentStatus,
  },

  /** Customer questions and the brand's answers. */
  qna: [
    {
      q: "Will it fit inside cleats?",
      asker: "Dawn",
      date: "2026-10-14",
      a: "It's a slim knit made to sit under a sock inside cleats and sports shoes. We're trying it in common youth cleats with our own sample and will list what we find.",
      status: "tbc" as ContentStatus,
    },
    {
      q: "My son is between sizes. Which should I pick?",
      asker: "Luis",
      date: "2026-10-06",
      a: "Go up one, after measuring around the ankle just above the ankle bone. If it's still not right, we'll swap the size for free.",
    },
    {
      q: "Can a nine-year-old put it on alone?",
      asker: "Becca",
      date: "2026-09-27",
      a: "Usually after one practice run with you. Slide it on, cross the strap over the foot, round the back of the heel and press it closed. The card in the box shows each step.",
    },
    {
      q: "Do I need one sleeve or two?",
      asker: "Omar",
      date: "2026-09-19",
      a: "Sleeves are sold one at a time. Most families choose a pair so both feet match, and a second pair means one is always clean.",
    },
    {
      q: "Does the strap catch on the knit?",
      asker: "Hannah",
      date: "2026-09-08",
      a: "The hook-and-loop can catch if it's left open. Press it closed before taking the sleeve off and before washing, and use a mesh bag.",
    },
    {
      q: "How long can my child wear it?",
      asker: "Grace",
      date: "2026-08-30",
      a: "Ask your child's doctor or physio. Take it off if it feels too tight, causes tingling or numbness, or leaves deep marks.",
    },
    {
      q: "Can it go in the dryer?",
      asker: "Pete",
      date: "2026-08-17",
      a: "Air dry it. Heat wears out the stretch and the hook-and-loop faster.",
    },
    {
      q: "Which colours are there?",
      asker: "Mia",
      date: "2026-08-02",
      a: "Black, or black with blue, green or red trim. Kids with two pairs often pick two colours so they're easy to tell apart.",
    },
  ],

  /** Customer photo wall: review photos first, then lifestyle shots. */
  ugc: [
    "review-a",
    "strip-03",
    "review-b",
    "strip-01",
    "review-c",
    "review-d",
    "strip-06",
    "review-e",
    "strip-04",
    "review-f",
    "strip-07",
    "review-g",
  ] as ImageId[],
};

export type Proof = typeof proof;

/** "4.8" */
export const ratingLabel = proof.rating.average.toFixed(1);
/** "1,284" */
export const ratingCount = proof.rating.count.toLocaleString("en-US");

/** Replace {rating}, {count}, {customers}, {days} and {free} in concept copy. */
export function fillProof(text: string) {
  return text
    .replaceAll("{rating}", ratingLabel)
    .replaceAll("{count}", ratingCount)
    .replaceAll("{customers}", proof.customers.value)
    .replaceAll("{days}", String(proof.guarantee.days))
    .replaceAll("{free}", `$${proof.shipping.freeOver}`);
}
