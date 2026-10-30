// Commercial terms for the two offer presentations. ALL NUMBERS ARE
// ILLUSTRATIVE: they sit near the competitor's public pricing ($34.99 a
// sleeve, falling to about $20 in a 6-pack, on 26 Oct 2026) so the pages read
// realistically, but no price, discount, bundle or gift has been approved.
// Change them here; no component hard-codes a price.

import type { Bundle, BundleId, Gift, GiftId, Offer, OfferId } from "./types";

export const gifts: Record<GiftId, Gift> = {
  guide: {
    id: "guide",
    name: "Parent guide (digital)",
    value: 9.99,
    image: "gallery-included",
  },
  "wash-bag": {
    id: "wash-bag",
    name: "Mesh wash bag",
    value: 7.99,
    image: "wash-bag",
  },
};

export const offers: Record<OfferId, Offer> = {
  standard: {
    id: "standard",
    name: "Standard",
    illustrative: true,
    defaultBundle: "pair",
    bundles: [
      { id: "one", quantity: 1, price: 34.99, compareAt: 49.99, gifts: [] },
      {
        id: "pair",
        quantity: 2,
        price: 59.98,
        compareAt: 99.98,
        gifts: ["guide"],
        badge: "Most popular",
      },
      {
        id: "two-pairs",
        quantity: 4,
        price: 99.96,
        compareAt: 199.96,
        gifts: ["guide", "wash-bag"],
        badge: "Best value",
      },
    ],
  },
  "black-friday": {
    id: "black-friday",
    name: "Black Friday",
    illustrative: true,
    defaultBundle: "pair",
    bundles: [
      {
        id: "one",
        quantity: 1,
        price: 29.99,
        compareAt: 49.99,
        gifts: ["guide"],
      },
      {
        id: "pair",
        quantity: 2,
        price: 49.98,
        compareAt: 99.98,
        gifts: ["guide", "wash-bag"],
        badge: "Most gifted",
      },
      {
        id: "two-pairs",
        quantity: 4,
        price: 84.96,
        compareAt: 199.96,
        gifts: ["guide", "wash-bag"],
        badge: "Best value",
      },
    ],
  },
};

export const offerIds = Object.keys(offers) as OfferId[];

export function isOfferId(value: string | undefined): value is OfferId {
  return !!value && value in offers;
}

export function getBundle(offer: Offer, id: BundleId) {
  return offer.bundles.find((b) => b.id === id) ?? offer.bundles[0];
}

const round = (n: number) => Math.round(n * 100) / 100;

export function pricing(bundle: Bundle) {
  const giftValue = round(
    bundle.gifts.reduce((sum, id) => sum + gifts[id].value, 0),
  );
  return {
    total: bundle.price,
    compareAt: bundle.compareAt,
    saving: round(bundle.compareAt - bundle.price),
    perUnit: round(bundle.price / bundle.quantity),
    giftValue,
  };
}

export function money(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value);
}
