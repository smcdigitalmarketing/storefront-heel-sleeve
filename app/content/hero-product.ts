import { SLEEVE_HANDLE, type ColourId, type SizeId } from "./catalog";

/**
 * The product the SOP page sells, at /products/<handle>. In the real store it
 * has two options: `colourOption`, whose values are the brand colour names in
 * `brand.store.colourNames` ("Night", "Royal"...), and `sizeOption`, whose
 * values are the size ids (S, M, L, XL).
 */
export const heroProduct = {
  handle: SLEEVE_HANDLE,
  colourOption: "Color",
  sizeOption: "Size",
  /**
   * Development stand-in on mock.shop (mvse.mock.shop), used while no Shopify
   * store is linked: a tee whose Color × Size options work like the sleeve's.
   * Each stand-in colour and size maps to one of ours, so the page shows
   * sleeve imagery and brand names while the cart holds real mock.shop
   * variants.
   */
  standIn: {
    handle: "mvse-libertee",
    colourOption: "Color",
    sizeOption: "Size",
    colours: {
      Black: "black",
      Navy: "blue",
      Lime: "green",
      Pink: "red",
    } satisfies Record<string, ColourId>,
    sizes: {
      S: "S",
      M: "M",
      L: "L",
      XL: "XL",
    } satisfies Record<string, SizeId>,
  },
} as const;
