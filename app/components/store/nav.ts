// Store URLs and navigation, shared by the header, mobile nav, footer and
// store pages. Ported from the mock's content/store-map.ts and StoreHeader.

import { brand } from "~/content/brand";
import { heroProduct } from "~/content/hero-product";
import { POLICY_SLUGS, type PolicySlug } from "~/content/policies";
import { policies } from "~/content/store-pages";

/** The SOP page for the Rally sleeve. */
export const PRODUCT_PATH = `/products/${heroProduct.handle}`;

/** The size and fit guide in the journal. */
export const GUIDE_SLUG = "how-to-size-and-fit-the-sleeve";

export const storePaths = {
  shop: "/collections",
  product: PRODUCT_PATH,
  how: "/how-it-works",
  journal: "/journal",
  faq: "/faq",
  about: "/about",
  contact: "/contact",
  account: "/account",
  search: "/search",
  advertorial: `/journal/${brand.advertorialSlug}`,
  guide: `/journal/${GUIDE_SLUG}`,
} as const;

export function policyPath(slug: PolicySlug) {
  return `/policies/${slug}`;
}

export function isPolicySlug(slug: string | undefined): slug is PolicySlug {
  return POLICY_SLUGS.includes(slug as PolicySlug);
}

export type NavItem = { label: string; to: string };

/** The brand's primary nav: shop, the sleeve, how it works, journal, FAQ. */
export const NAV_ITEMS: NavItem[] = [
  { label: brand.store.nav.shop, to: storePaths.shop },
  { label: brand.store.nav.product, to: storePaths.product },
  { label: brand.store.nav.how, to: storePaths.how },
  { label: brand.store.nav.journal, to: storePaths.journal },
  { label: "FAQ", to: storePaths.faq },
];

/** Secondary links in the mobile menu. */
export const HELP_ITEMS: NavItem[] = [
  { label: brand.store.nav.about, to: storePaths.about },
  { label: "Contact", to: storePaths.contact },
];

export const POLICY_ITEMS: NavItem[] = POLICY_SLUGS.map((slug) => ({
  label: policies[slug].title,
  to: policyPath(slug),
}));
