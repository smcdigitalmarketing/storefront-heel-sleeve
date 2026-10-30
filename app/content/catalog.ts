// The store catalogue. Names and descriptions are brand-voiced in the
// brand's `store` block; everything commercial here
// (range, colourways, sizes, prices) is ILLUSTRATIVE until the supplier and
// Russ confirm it. Heel sleeve prices come from offers.ts so both offers stay
// in sync.

import type { ImageId } from "./images";
import type { ContentStatus, Fact, FaqItem } from "./types";

export type ColourId = "black" | "blue" | "green" | "red";

export type Colour = {
  id: ColourId;
  /** Accent colour: the trim and strap stripes on a black sleeve. */
  swatch: string;
  thumb: ImageId;
  studio: ImageId;
};

export const colours: Colour[] = [
  {
    id: "black",
    swatch: "#6b6e73",
    thumb: "product-thumb",
    studio: "product-studio",
  },
  {
    id: "blue",
    swatch: "#1f5fd6",
    thumb: "colour-blue-thumb",
    studio: "colour-blue-studio",
  },
  {
    id: "green",
    swatch: "#8fe33a",
    thumb: "colour-green-thumb",
    studio: "colour-green-studio",
  },
  {
    id: "red",
    swatch: "#e2232f",
    thumb: "colour-red-thumb",
    studio: "colour-red-studio",
  },
];

export const colourIds = colours.map((c) => c.id);

/** The lead colourway: the homepage feature. */
export const LEAD_COLOUR: ColourId = "green";

export function getColour(id: ColourId) {
  return colours.find((c) => c.id === id) ?? colours[0];
}

export type SizeId = "S" | "M" | "L" | "XL";

/** The competitor's size chart (image, 26 Oct 2026), matched by its supplier's table. */
export const sizes: {
  id: SizeId;
  shoe: string;
  ankle: string;
}[] = [
  { id: "S", shoe: "US Youth 3–4.5", ankle: "6.7–7.5 in (17–19 cm)" },
  { id: "M", shoe: "US Youth 5–7", ankle: "7.5–8.7 in (19–21 cm)" },
  { id: "L", shoe: "US Youth 7 to Men's 9", ankle: "8.7–9.8 in (21–23 cm)" },
  { id: "XL", shoe: "US Men's 9–11", ankle: "9.8–11 in (23–25 cm)" },
];

export const sizeIds = sizes.map((s) => s.id);

export const SIZE_SOURCE =
  "Competitor size chart and CJ Dropshipping size table, 26 Oct 2026";

export type ProductId =
  "sleeve" | "knee-sleeve" | "game-day-kit" | "wash-bag" | "gift-card";

/** The product the SOP page sells; every other item has an item page. */
export const MAIN_PRODUCT = "sleeve" satisfies ProductId;

export type Category = "sleeves" | "accessories" | "gifts";

export type CatalogProduct = {
  id: ProductId;
  category: Category;
  /** Single-unit price. The heel sleeve's real prices live in offers.ts. */
  price: number;
  compareAt?: number;
  images: ImageId[];
  /** Specs shown on the product page, each with its status. */
  specs: Fact[];
  related: ProductId[];
  /** Offers a colour choice (heel sleeve and game-day kit). */
  hasColour?: boolean;
  /** Offers a size choice. */
  hasSize?: boolean;
  /** Gift card denominations. */
  amounts?: number[];
  /** Searchable keywords beyond the name. */
  keywords: string[];
  /** Item page copy, shared by every concept (the sleeve uses its own page). */
  details?: {
    description: string[];
    highlights: string[];
    faq: FaqItem[];
  };
};

const ILLUSTRATIVE: ContentStatus = "illustrative";
const LISTED = "asoleo.com product listing, 26 Oct 2026";

export const catalog: CatalogProduct[] = [
  {
    id: "sleeve",
    category: "sleeves",
    price: 34.99,
    compareAt: 49.99,
    images: ["product-studio", "gallery-in-use", "step-strap", "life-soccer"],
    specs: [],
    related: ["wash-bag", "knee-sleeve", "game-day-kit"],
    hasColour: true,
    hasSize: true,
    keywords: [
      "heel",
      "ankle",
      "sleeve",
      "compression",
      "strap",
      "cleats",
      "kids",
      "youth",
    ],
  },
  {
    id: "game-day-kit",
    category: "sleeves",
    price: 69.99,
    compareAt: 87.97,
    images: ["kit-flatlay", "life-kitbag", "pair-pack", "life-sideline"],
    specs: [
      {
        label: "In the kit",
        value:
          "Two heel sleeves (one size and colour), a mesh wash bag and a sizing card",
        status: ILLUSTRATIVE,
      },
      {
        label: "Compare-at",
        value: "Sum of the items bought separately",
        status: ILLUSTRATIVE,
      },
    ],
    related: ["wash-bag", "gift-card"],
    hasColour: true,
    hasSize: true,
    keywords: ["kit", "bundle", "pair", "gift", "game day", "set"],
    details: {
      description: [
        "Everything a season needs, in one box: two heel sleeves in the size and colour you pick, a zip mesh wash bag, and a sizing and fit card. One pair on the feet, the bag in the laundry, and nothing to hunt for on Saturday morning.",
        "It's the set we'd give a new team family. Bought together, it costs less than the pieces separately, and it all arrives in one box.",
      ],
      highlights: [
        "Two heel sleeves, one size and colour",
        "Mesh wash bag and a sizing card included",
        "Costs less than buying each piece separately",
        "Free size swap if the size is wrong",
      ],
      faq: [
        {
          q: "Can the two sleeves be different sizes?",
          a: "Not in the kit: both sleeves come in one size and colour. For two sizes, choose two singles or the two-pair bundle.",
        },
        {
          q: "Is the kit cheaper than buying the pieces?",
          a: "Yes. The compare-at price is the sum of the items bought separately.",
          status: "illustrative",
        },
      ],
    },
  },
  {
    id: "knee-sleeve",
    category: "sleeves",
    price: 29.99,
    images: ["knee-sleeve", "life-basketball"],
    specs: [
      {
        label: "Type",
        value: "Knitted knee compression sleeve with an open kneecap ring",
        status: ILLUSTRATIVE,
      },
      {
        label: "Range",
        value:
          "The competitor sells a matching knee sleeve; ours is to be confirmed",
        status: "tbc",
        source: LISTED,
      },
    ],
    related: ["sleeve", "wash-bag"],
    hasSize: true,
    keywords: ["knee", "sleeve", "compression", "basketball"],
    details: {
      description: [
        "A knitted knee sleeve with an open ring around the kneecap, made to match the heel sleeve. It pulls on like a sock and sits under shorts or a uniform.",
        "We're still confirming our range and sizes with the supplier, so this page is a preview.",
      ],
      highlights: [
        "Stretch knit with an open kneecap ring",
        "Matches the heel sleeve",
        "Sizes by thigh measurement (chart to be confirmed)",
        "Washes like the heel sleeve",
      ],
      faq: [
        {
          q: "How do I size it?",
          a: "Measure around the leg just above the knee. We'll publish the size chart once the supplier confirms it.",
          status: "tbc",
        },
      ],
    },
  },
  {
    id: "wash-bag",
    category: "accessories",
    price: 7.99,
    images: ["wash-bag", "kit-flatlay"],
    specs: [
      {
        label: "Type",
        value: "Zip mesh laundry bag that keeps the straps from snagging",
        status: ILLUSTRATIVE,
      },
      {
        label: "Fits",
        value: "Up to four sleeves",
        status: ILLUSTRATIVE,
      },
    ],
    related: ["sleeve", "game-day-kit"],
    keywords: ["wash", "laundry", "mesh", "bag", "care"],
    details: {
      description: [
        "A zip mesh laundry bag that holds up to four sleeves. Close the straps, zip them in, and they come out of the wash without snagging everything else.",
        "It also keeps pairs together, so nobody's hunting for the second sleeve before practice.",
      ],
      highlights: [
        "Fits up to four sleeves",
        "Stops straps snagging in the wash",
        "Keeps pairs together",
        "Included free with two pairs",
      ],
      faq: [
        {
          q: "Can it go in the dryer?",
          a: "The bag can, but the sleeves shouldn't: air dry them.",
        },
      ],
    },
  },
  {
    id: "gift-card",
    category: "gifts",
    price: 25,
    images: [],
    specs: [
      {
        label: "Delivery",
        value: "Digital, sent by email",
        status: ILLUSTRATIVE,
      },
      { label: "Expiry", value: "To be confirmed", status: "tbc" },
    ],
    related: ["game-day-kit", "sleeve"],
    amounts: [25, 50, 100],
    keywords: ["gift", "card", "voucher", "present"],
    details: {
      description: [
        "Not sure of their size or favourite colour? Send a digital gift card and let them measure and choose. It works on the sleeves, the kit and every accessory.",
        "Gift cards are sent by email with your message.",
      ],
      highlights: [
        "$25, $50 or $100",
        "Sent by email with your message",
        "Works on everything in the store",
        "Expiry to be confirmed",
      ],
      faq: [
        {
          q: "Do discount codes work on gift cards?",
          a: "No. Discount codes don't apply to gift cards.",
        },
      ],
    },
  },
];

export function getProduct(id: ProductId) {
  return catalog.find((p) => p.id === id)!;
}

/** Shopify handles. The heel sleeve's handle is its brand product name (see hero-product.ts). */
export const SLEEVE_HANDLE = "rally-heel-sleeve";

export function handleFor(id: ProductId) {
  return id === "sleeve" ? SLEEVE_HANDLE : id;
}

export function productFromHandle(handle: string) {
  if (handle === SLEEVE_HANDLE) return getProduct("sleeve");
  return catalog.find((p) => p.id === handle && p.id !== "sleeve");
}
