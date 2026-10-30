import type { HeroProduct } from "~/lib/hero-product";
import { useOfferId } from "~/lib/offer";

import { Divider } from "../brand/Divider";
import { SelectionProvider } from "./selection";
import { Closing } from "./sections/Closing";
import { Details } from "./sections/Details";
import { HeroSections } from "./sections/AboveFold";
import { SocialProof } from "./sections/SocialProof";
import { ValueProps } from "./sections/ValueProps";
import { StickyCart } from "./StickyCart";

/**
 * The SOP product page: seven sections in a fixed order (above the fold, buy
 * box, under the button, details, social proof, value props, closing), each
 * marked with data-sop-section.
 */
export function ProductPage({ hero }: { hero: HeroProduct }) {
  const offerId = useOfferId();

  return (
    // Keyed on the offer so a preview switch starts from that offer's default bundle.
    <SelectionProvider key={offerId} hero={hero}>
      <HeroSections />
      <Divider />
      <Details />
      <SocialProof />
      <ValueProps />
      <Divider />
      <Closing />
      <StickyCart />
    </SelectionProvider>
  );
}
