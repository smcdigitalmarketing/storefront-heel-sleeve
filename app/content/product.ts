// Product facts shared by every concept. Nothing here has been confirmed by
// Russ or the supplier yet: facts come from the competitor's listing and its
// supplier's (CJ Dropshipping) product page for what appears to be the same
// sleeve, and are labelled as such on the page.
//
// This is a children's health-adjacent product. The facts below describe what
// the sleeve is and does mechanically. They never claim to treat, heal,
// relieve or prevent anything (see docs/recoverx/competitor-analysis.md).

import type { Fact, FaqItem, Step } from "./types";

const LISTING = "asoleo.com product listing, 26 Oct 2026";
const SUPPLIER = "CJ Dropshipping listing (SKU CJYDYDYD00980), 26 Oct 2026";

/** Shown wherever a page talks about heel pain. Same words in every brand. */
export const HEEL_NOTE =
  "Heel pain in growing kids should be checked by a doctor or physio. This sleeve isn't a treatment and doesn't replace their advice.";

export const product = {
  category: "Youth heel and ankle support sleeve",
  /** Facts we are comfortable showing (labelled until confirmed). */
  facts: {
    type: {
      label: "What it is",
      value:
        "A knitted ankle compression sleeve that covers the heel and ankle, open at the toes",
      status: "competitor-listed",
      source: LISTING,
    },
    strap: {
      label: "Strap",
      value:
        "One hook-and-loop strap that wraps the ankle in a figure-8 and crosses behind the heel, so you set the snugness",
      status: "competitor-listed",
      source: LISTING,
    },
    fit: {
      label: "In shoes",
      value:
        "Slim enough to wear under socks inside cleats and sports shoes. We're testing this on our own sample",
      status: "tbc",
      source: LISTING,
    },
    material: {
      label: "Material",
      value: "Nylon knit with stretch. Exact blend to be confirmed",
      status: "tbc",
      source: SUPPLIER,
      note: 'The supplier lists only "Body material: nylon"; the competitor says nylon and spandex.',
    },
    sizes: {
      label: "Sizes",
      value: "S, M, L, XL by shoe size and ankle measurement",
      status: "competitor-listed",
      source: LISTING,
    },
    colours: {
      label: "Colours",
      value: "Black, or black with blue, green or red trim",
      status: "competitor-listed",
      source: LISTING,
    },
    care: {
      label: "Care",
      value: "Fasten the strap, wash cold in a mesh bag, air dry",
      status: "competitor-listed",
      source: LISTING,
    },
    soldAs: {
      label: "Sold as",
      value: "Single sleeves. A pair covers both feet",
      status: "competitor-listed",
      source: LISTING,
    },
  } satisfies Record<string, Fact>,

  /** What comes in the box, per sleeve. Packaging not yet seen. */
  included: [
    { name: "Heel sleeve", detail: "Strap attached" },
    { name: "Sizing card", detail: "How to measure and fit" },
    {
      name: "Parent guide",
      detail: "Fit, wear and care tips (with 2+ sleeves)",
    },
  ],

  howItWorks: [
    {
      title: "Slide it on",
      body: "Pull the sleeve over the foot until the heel sits in its pocket.",
      image: "step-on",
    },
    {
      title: "Wrap the strap",
      body: "Cross the strap over the foot and round the back of the heel, snug but not tight.",
      image: "step-strap",
    },
    {
      title: "Lace up",
      body: "Socks and cleats go on as usual, right over the sleeve.",
      image: "step-lace",
    },
  ] satisfies Step[],

  /** Rows for the us-vs-alternatives slide and the comparison table. */
  comparison: {
    columns: ["This sleeve", "Plain tube sleeve", "Athletic tape"],
    rows: [
      {
        label: "Adjustable snugness",
        values: ["Yes, with the strap", "No", "Re-taped every time"],
      },
      {
        label: "Wraps behind the heel",
        values: ["Yes, figure-8 strap", "No", "Depends on the taping"],
      },
      {
        label: "Reusable and washable",
        values: ["Yes", "Yes", "No, single use"],
      },
      {
        label: "Fits under socks in cleats",
        values: ["Slim knit (testing)", "Usually", "Yes"],
      },
      {
        label: "A kid can put it on alone",
        values: ["Yes, after a practice run", "Yes", "Usually needs an adult"],
      },
    ],
  },

  /** Stats band. Every number is a product fact, not a performance claim. */
  stats: [
    { value: "4", label: "sizes, youth 3 to adult 11" },
    { value: "4", label: "colours" },
    { value: "1", label: "strap that wraps the heel" },
    { value: "2", label: "in a pair: one for each foot" },
  ],

  /** Grouped on the page under each item's category, in this order. */
  faq: [
    {
      category: "The sleeve",
      q: "Is this a treatment for heel pain or Sever's disease?",
      a: "No. It's a compression sleeve with an adjustable strap. Heel pain in growing kids should be checked by a doctor or physio, and their advice comes first, including whether a sleeve is a good idea and how long to wear it.",
    },
    {
      category: "The sleeve",
      q: "What is it made of?",
      a: "A stretchy nylon knit with a hook-and-loop strap. We're confirming the exact blend with the supplier.",
      status: "tbc",
    },
    {
      category: "The sleeve",
      q: "Will it fit inside cleats?",
      a: "It's a slim knit made to sit under socks inside sports shoes. We're trying it in common youth cleats with our own sample before we say more.",
      status: "tbc",
    },
    {
      category: "The sleeve",
      q: "Which colours are there?",
      a: "Black, or black with blue, green or red trim.",
      status: "competitor-listed",
    },
    {
      category: "Sizing and fit",
      q: "How do I choose a size?",
      a: "Measure around the ankle just above the ankle bone and check it against the size guide with your child's shoe size. Between sizes? Go up one.",
    },
    {
      category: "Sizing and fit",
      q: "How snug should it be?",
      a: "Snug, not tight: you should be able to slide a finger under the strap. Take it off if it feels too tight, causes tingling or numbness, or leaves deep marks.",
    },
    {
      category: "Sizing and fit",
      q: "One sleeve or a pair?",
      a: "Sleeves are sold one at a time. Most families choose a pair so both feet match, and a second pair means one is always clean for practice.",
    },
    {
      category: "Sizing and fit",
      q: "Can my child wear it all day?",
      a: "Ask your child's doctor or physio. Take it off if it feels too tight, causes tingling or numbness, or leaves deep marks.",
    },
    {
      category: "Care",
      q: "How do I wash it?",
      a: "Fasten the strap so it doesn't snag, wash cold in a mesh bag and let it air dry.",
    },
    {
      category: "Care",
      q: "How long will it last?",
      a: "Washed with the strap closed and air dried, it's made to last a season of practices. Our 6-month quality promise covers the strap and seams.",
      status: "tbc",
    },
    {
      category: "Shipping and returns",
      q: "How much is shipping, and how fast is it?",
      a: "Standard shipping is free on orders over $50 (so a pair ships free), and orders ship in 1–2 business days with tracking. Express is available at checkout.",
      status: "tbc",
    },
    {
      category: "Shipping and returns",
      q: "What if the size is wrong?",
      a: "We'll swap it for free within 30 days. Reply to your order email and we'll send a prepaid label.",
      status: "tbc",
    },
    {
      category: "Shipping and returns",
      q: "What's your returns policy?",
      a: "Send it back within 30 days of delivery for a full refund, even if it's been worn. Please wash it first.",
      status: "tbc",
    },
    {
      category: "Gifting",
      q: "Can I give it as a gift if I don't know the size?",
      a: "Yes. Send a digital gift card so they can measure and choose, or order your best guess and swap the size for free.",
    },
  ] satisfies FaqItem[],

  /** Materials and care, shown in the details accordion. */
  materials: [
    {
      label: "Knit",
      value: "Nylon knit with stretch. Exact blend to be confirmed",
      status: "tbc",
      source: SUPPLIER,
    },
    {
      label: "Strap",
      value: "Hook-and-loop strap, stitched to the sleeve at one end",
      status: "competitor-listed",
      source: LISTING,
    },
    {
      label: "Weight",
      value: "To be confirmed",
      status: "tbc",
    },
  ] satisfies Fact[],

  care: [
    "Fasten the strap before washing so it doesn't snag.",
    "Wash cold in a mesh bag with similar colours.",
    "Air dry. No dryer and no iron.",
    "Keep one pair in the kit bag and one in the wash.",
  ],

  /** Shown under "Sizing and fit" in the details accordion. */
  fitTips: [
    "Measure around the ankle just above the ankle bone, then check the shoe size too.",
    "Between sizes? Go up one.",
    "Snug, not tight: you should fit a finger under the strap.",
    "Sleeve first, then the sock over it, then the shoe.",
    "Check the size each season. Growing feet move up a size.",
  ],

  /** Feature pins on product-studio, as percentages of the image. */
  callouts: [
    {
      title: "Ribbed cuff",
      body: "A soft top edge that sits under a sock.",
      x: 51,
      y: 18,
    },
    {
      title: "Stretch knit",
      body: "Covers the heel and ankle, and moves with them.",
      x: 41,
      y: 31,
    },
    {
      title: "Hook-and-loop end",
      body: "Press to close: you set how snug it is.",
      x: 35,
      y: 42,
    },
    {
      title: "Figure-8 strap",
      body: "Crosses over the foot and wraps behind the heel.",
      x: 52,
      y: 52,
    },
    {
      title: "Heel pocket",
      body: "The heel sits in its pocket, so it goes on the same way every time.",
      x: 27,
      y: 63,
    },
    {
      title: "Open toe",
      body: "Open at the front, so it works with any sock and shoe.",
      x: 66,
      y: 80,
    },
  ],

  policies: {
    shipping: {
      title: "Shipping",
      body: "Free standard shipping over $50, so a pair ships free. Orders ship in 1–2 business days with tracking; express is available at checkout.",
      status: "tbc",
    },
    returns: {
      title: "Returns and exchanges",
      body: "Free size swaps, and 30 days from delivery for a full refund even if it's been worn. We send a prepaid label.",
      status: "tbc",
    },
    guarantee: {
      title: "Guarantee",
      body: "30-day fit guarantee, plus a 6-month quality promise on the strap and seams. Proposed terms: Russ to confirm before launch.",
      status: "tbc",
    },
  },
} as const;

export type ProductFacts = typeof product;
