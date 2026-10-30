// Content for the store's help, guide and policy pages. Nothing here adds a
// product claim: facts come from product.ts, and anything commercial or legal
// is a labelled placeholder. Orders aren't open yet: the store is in development.

import type { ImageId } from "./images";
import { product } from "./product";
import type { PolicySlug } from "./policies";
import type { ContentStatus, FaqItem } from "./types";

export type FaqCategory = { id: string; title: string; items: FaqItem[] };

export const faqCategories: FaqCategory[] = [
  {
    id: "sleeve",
    title: "Using the sleeve",
    items: [...product.faq.slice(0, 6)],
  },
  {
    id: "orders",
    title: "Orders and shipping",
    items: [
      {
        q: "How much is shipping and how long does it take?",
        a: "Rates and delivery times are still being set. Orders aren't open yet: this store is in development.",
        status: "tbc",
      },
      {
        q: "Can I change or cancel my order?",
        a: "The process for changes and cancellations is still to be confirmed.",
        status: "tbc",
      },
      {
        q: "Do you ship internationally?",
        a: "Shipping destinations are still to be confirmed.",
        status: "tbc",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns and guarantee",
    items: [
      {
        q: "What's your returns policy?",
        a: product.policies.returns.body,
        status: "tbc",
      },
      {
        q: "Is there a guarantee?",
        a: product.policies.guarantee.body,
        status: "tbc",
      },
    ],
  },
  {
    id: "gift-cards",
    title: "Gift cards",
    items: [
      {
        q: "How are gift cards delivered?",
        a: "By email after purchase. Orders aren't open yet, so no gift cards have been sent.",
        status: "placeholder",
      },
      {
        q: "Do gift cards expire?",
        a: "Expiry terms are still to be confirmed.",
        status: "tbc",
      },
    ],
  },
  {
    id: "store",
    title: "About this store",
    items: [
      {
        q: "Can I place an order yet?",
        a: "Not yet. This store is in development and orders aren't open, so nothing can be bought and no payment is taken.",
      },
      {
        q: "Where is my cart stored?",
        a: "With Shopify, the platform this store runs on. There's no order history yet, because orders aren't open.",
      },
    ],
  },
];

export const guideSteps = [
  {
    title: "Measure the ankle",
    body: "Wrap a soft tape measure around the ankle just above the ankle bone, snug but not tight.",
  },
  {
    title: "Check the size guide",
    body: "Match the measurement and your child's shoe size to S, M, L or XL. Between sizes? Go up one.",
  },
  {
    title: "Put it on",
    body: "Slide the sleeve over the foot until the heel sits in its pocket, then wrap the strap in a figure-8 round the heel.",
  },
  {
    title: "Check the fit",
    body: "It should feel snug, not tight. Take it off if your child feels tingling or numbness or it leaves deep marks, and loosen the strap next time.",
  },
];

export type PolicyPage = {
  title: string;
  intro: string;
  sections: { heading: string; body: string; status?: ContentStatus }[];
};

export const policies: Record<PolicySlug, PolicyPage> = {
  shipping: {
    title: "Shipping policy",
    intro:
      "Shipping terms have not been set yet. This page shows the structure the final policy will follow.",
    sections: [
      {
        heading: "Rates",
        body: "Final shipping rates will be listed here.",
        status: "tbc",
      },
      {
        heading: "Delivery times",
        body: "Delivery estimates will be listed per destination once confirmed.",
        status: "tbc",
      },
      {
        heading: "Destinations",
        body: "The countries we ship to will be listed here.",
        status: "tbc",
      },
    ],
  },
  returns: {
    title: "Returns and refunds",
    intro: product.policies.returns.body,
    sections: [
      { heading: "Return window", body: "To be confirmed.", status: "tbc" },
      {
        heading: "Condition of items",
        body: "To be confirmed.",
        status: "tbc",
      },
      {
        heading: "Guarantee",
        body: product.policies.guarantee.body,
        status: "tbc",
      },
    ],
  },
  privacy: {
    title: "Privacy",
    intro:
      "This store is in development and orders aren't open, so no payment details are taken.",
    sections: [
      {
        heading: "Your cart",
        body: "Your cart is held by Shopify, the platform this store runs on.",
      },
      {
        heading: "Cookies and analytics",
        body: "The cookies and analytics this store uses will be listed in the full privacy policy.",
        status: "tbc",
      },
      {
        heading: "The live store",
        body: "A full privacy policy will be written for production.",
        status: "tbc",
      },
    ],
  },
  terms: {
    title: "Terms of service",
    intro: "Terms of service for the production store are still to be written.",
    sections: [
      {
        heading: "In development",
        body: "Orders aren't open yet: this store is in development, so no contract of sale can be formed here.",
      },
    ],
  },
};

export type GuideArticle = {
  kicker: string;
  headline: string;
  dek: string;
  readTime: string;
  image: ImageId;
};

export const guideArticle: GuideArticle = {
  kicker: "Guide",
  headline: "How to size and fit your child's sleeve",
  dek: "Measure, match, fit and check: four steps to the right size.",
  readTime: "2 min read",
  image: "step-strap",
};
