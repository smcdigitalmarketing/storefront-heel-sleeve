import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "react-router";

import {
  colourIds,
  sizeIds,
  type ColourId,
  type SizeId,
} from "~/content/catalog";
import { getBundle, pricing } from "~/content/offers";
import type { BundleId } from "~/content/types";
import {
  addLinesToCart,
  bundleLines,
  waitForUpdateCart,
} from "~/lib/bundle-cart";
import { useCart, useCartActions } from "~/lib/cart";
import { openCartDrawer } from "~/lib/cart-drawer";
import {
  heroVariant,
  type HeroColour,
  type HeroProduct,
  type HeroSize,
} from "~/lib/hero-product";
import { useOffer } from "~/lib/offer";

type Selection = ReturnType<typeof useSelectionState>;

const SelectionContext = createContext<Selection | null>(null);

/** The fit step's anchor: the button and sticky bar scroll here when a size is missing. */
export const FIT_STEP_ID = "fit-step";

function requestedSize(searchParams: URLSearchParams): SizeId | null {
  const size = searchParams.get("size")?.toUpperCase() as SizeId | undefined;
  return size && sizeIds.includes(size) ? size : null;
}

function useSelectionState(hero: HeroProduct) {
  const { id: offerId, offer } = useOffer();
  const cartId = useCart((state) => state.data.id);
  const { refresh } = useCartActions();
  const [searchParams] = useSearchParams();
  const slots = Math.max(...offer.bundles.map((bundle) => bundle.quantity));
  const firstColour =
    hero.colours.find((colour) => colour.available)?.id ??
    hero.colours[0]?.id ??
    "black";
  const [bundleId, setBundleId] = useState<BundleId>(offer.defaultBundle);
  // One colour and size per sleeve; a bundle uses the first `quantity` of
  // them. No size is preselected: a wrong size is the likeliest return. A
  // `?size=` link (the no-JavaScript size chips) preselects every sleeve.
  const [colours, setColours] = useState<ColourId[]>(() =>
    Array(slots).fill(firstColour),
  );
  const [sizes, setSizes] = useState<(SizeId | null)[]>(() =>
    Array(slots).fill(requestedSize(searchParams)),
  );
  const [previewColour, setPreviewColour] = useState<ColourId>(firstColour);
  const [showSizeHint, setShowSizeHint] = useState(false);
  const [adding, setAdding] = useState(false);
  const ctaRef = useRef<HTMLButtonElement>(null);
  const bundle = getBundle(offer, bundleId);
  const chosen = colours.slice(0, bundle.quantity);
  const chosenSizes = sizes.slice(0, bundle.quantity);
  const missingSize = chosenSizes.some((size) => !size);

  // Links from the home and shop pages can preselect a colour (?colour=red)
  // or a size (?size=M).
  useEffect(() => {
    const requested = searchParams.get("colour") as ColourId | null;
    if (requested && colourIds.includes(requested)) {
      setColours(Array(slots).fill(requested));
      setPreviewColour(requested);
    }
    const size = requestedSize(searchParams);
    if (size) setSizes(Array(slots).fill(size));
  }, [searchParams, slots]);

  return useMemo(
    () => ({
      hero,
      offerId,
      offer,
      bundle,
      price: pricing(bundle),
      setBundleId,
      /** The colour of each sleeve in the chosen bundle. */
      colours: chosen,
      /** The size of each sleeve in the chosen bundle; null until picked. */
      sizes: chosenSizes,
      /** Every slot, for previewing other bundle sizes. */
      allColours: colours,
      previewColour,
      setPreviewColour,
      /** True until every sleeve in the bundle has a size. */
      missingSize,
      /** Set when someone presses add to cart without a size. */
      showSizeHint,
      setColour(slot: number, colour: ColourId) {
        setColours((current) =>
          current.map((c, i) => (i === slot ? colour : c)),
        );
        setPreviewColour(colour);
      },
      setSize(slot: number, size: SizeId) {
        // One size usually fits the whole bundle, so it fills the empty slots too.
        setSizes((current) =>
          current.map((s, i) => (i === slot ? size : (s ?? size))),
        );
        setShowSizeHint(false);
      },
      /** The colourway as the product sells it, if it does. */
      colourVariant(colour: ColourId): HeroColour | undefined {
        return hero.colours.find((candidate) => candidate.id === colour);
      },
      /** The variant behind one colour in one size, if the product sells it. */
      sizeVariant(colour: ColourId, size: SizeId | null): HeroSize | undefined {
        return heroVariant(hero, colour, size);
      },
      /** Every chosen colour and size is sold and in stock (sizes may be unpicked). */
      canAdd: chosen.every((colour, i) => {
        const size = chosenSizes[i];
        return size
          ? heroVariant(hero, colour, size)?.available
          : hero.colours.find((candidate) => candidate.id === colour)
              ?.available;
      }),
      adding,
      /**
       * Adds the bundle as one cart line per variant, tagged with the bundle,
       * then opens the cart. With a size missing it points at the fit step
       * instead. Returns false when the cart store isn't ready (no JavaScript
       * yet), so the caller's no-JS form can submit instead.
       */
      async addToCart(): Promise<boolean> {
        if (missingSize) {
          setShowSizeHint(true);
          document
            .getElementById(FIT_STEP_ID)
            ?.scrollIntoView({ behavior: "smooth", block: "center" });
          return true;
        }
        if (!(await waitForUpdateCart())) return false;
        const variantIds = chosen.flatMap((colour, i) => {
          const variant = heroVariant(hero, colour, chosenSizes[i]!);
          return variant ? [variant.variantId] : [];
        });
        setAdding(true);
        try {
          const split = await addLinesToCart(
            bundleLines(variantIds, { bundleId: bundle.id, offerId }),
            { hasCart: Boolean(cartId) },
          );
          // The first bundle in a new cart goes in two calls; refresh so the
          // drawer lists every line, not just the first call's.
          if (split) await refresh();
          openCartDrawer();
        } finally {
          setAdding(false);
        }
        return true;
      },
      /** The main add-to-cart button; the sticky bar watches it. */
      ctaRef,
    }),
    [
      hero,
      offerId,
      offer,
      bundle,
      chosen,
      chosenSizes,
      colours,
      previewColour,
      missingSize,
      showSizeHint,
      adding,
      cartId,
      refresh,
    ],
  );
}

export function SelectionProvider({
  hero,
  children,
}: {
  hero: HeroProduct;
  children: ReactNode;
}) {
  const value = useSelectionState(hero);
  return (
    <SelectionContext.Provider value={value}>
      {children}
    </SelectionContext.Provider>
  );
}

/** The selection inside the SOP page, or null elsewhere. */
export function useOptionalSelection() {
  return useContext(SelectionContext);
}

export function useSelection() {
  const value = useContext(SelectionContext);
  if (!value)
    throw new Error("useSelection must be used inside SelectionProvider");
  return value;
}
