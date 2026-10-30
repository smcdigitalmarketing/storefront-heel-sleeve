import { gql } from "@shopify/hydrogen";
import type { MoneyV2 } from "@shopify/hydrogen/storefront-api-types";

import { brand } from "~/content/brand";
import {
  colours as catalogColours,
  sizeIds,
  type ColourId,
  type SizeId,
} from "~/content/catalog";
import { heroProduct } from "~/content/hero-product";

export const HERO_PRODUCT_QUERY = gql(`
  query HeroProduct($handle: String!) {
    product(handle: $handle) {
      id
      handle
      title
      vendor
      options {
        name
        optionValues {
          name
          swatch {
            color
          }
        }
      }
      variants(first: 100) {
        nodes {
          id
          title
          sku
          availableForSale
          selectedOptions {
            name
            value
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
      }
    }
  }
`);

type Money = Pick<MoneyV2, "amount" | "currencyCode">;

type HeroProductData = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  options: Array<{
    name: string;
    optionValues: Array<{
      name: string;
      swatch?: { color?: string | null } | null;
    }>;
  }>;
  variants: {
    nodes: Array<{
      id: string;
      title: string;
      sku?: string | null;
      availableForSale: boolean;
      selectedOptions: Array<{ name: string; value: string }>;
      price: Money;
      compareAtPrice?: Money | null;
    }>;
  };
};

/** One size of a colourway, resolved to the Shopify variant that sells it. */
export type HeroSize = {
  id: SizeId;
  /** The Shopify option value ("M", or a stand-in's own size name). */
  optionValue: string;
  variantId: string;
  variantTitle: string;
  sku: string | null;
  available: boolean;
  price: Money;
};

/** One of our colourways, with the sizes the product sells it in. */
export type HeroColour = {
  id: ColourId;
  /** The brand's name for the colourway. */
  name: string;
  /** The Shopify option value ("Night", or a stand-in's "Black"). */
  optionValue: string;
  swatch: string;
  /** Sizes in catalogue order; only the ones the product sells. */
  sizes: HeroSize[];
  /** True when at least one size is in stock. */
  available: boolean;
  /** The first size's price (every size costs the same). */
  price: Money;
};

export type HeroProduct = {
  id: string;
  /** The Shopify handle actually queried (the stand-in's in mock mode). */
  shopifyHandle: string;
  title: string;
  vendor: string;
  /** True when a mock.shop stand-in supplies the variants. */
  standIn: boolean;
  colours: HeroColour[];
};

/** The Shopify handle to query for the hero product. */
export function heroQueryHandle(standIn: boolean): string {
  return standIn ? heroProduct.standIn.handle : heroProduct.handle;
}

function optionNames(standIn: boolean) {
  return standIn
    ? {
        colour: heroProduct.standIn.colourOption,
        size: heroProduct.standIn.sizeOption,
      }
    : { colour: heroProduct.colourOption, size: heroProduct.sizeOption };
}

function colourIdFor(
  optionValue: string,
  standIn: boolean,
): ColourId | undefined {
  if (standIn) {
    return (heroProduct.standIn.colours as Record<string, ColourId>)[
      optionValue
    ];
  }
  const value = optionValue.toLowerCase();
  return catalogColours.find(
    (colour) =>
      colour.id === value ||
      brand.store.colourNames[colour.id].toLowerCase() === value,
  )?.id;
}

function sizeIdFor(optionValue: string, standIn: boolean): SizeId | undefined {
  if (standIn) {
    return (heroProduct.standIn.sizes as Record<string, SizeId>)[optionValue];
  }
  return sizeIds.find((id) => id === optionValue.toUpperCase());
}

/** Maps the Shopify product onto our colourways and sizes, in catalogue order. */
export function toHeroProduct(
  product: HeroProductData,
  standIn: boolean,
): HeroProduct {
  const names = optionNames(standIn);
  const option = (name: string) =>
    product.options.find((candidate) => candidate.name === name);
  const selected = (
    variant: HeroProductData["variants"]["nodes"][number],
    name: string,
  ) => variant.selectedOptions.find((o) => o.name === name)?.value;

  const colours = (option(names.colour)?.optionValues ?? []).flatMap(
    (value): HeroColour[] => {
      const id = colourIdFor(value.name, standIn);
      if (!id) return [];
      const sizes = product.variants.nodes.flatMap((variant): HeroSize[] => {
        if (selected(variant, names.colour) !== value.name) return [];
        const sizeValue = selected(variant, names.size);
        const sizeId = sizeValue ? sizeIdFor(sizeValue, standIn) : undefined;
        if (!sizeValue || !sizeId) return [];
        return [
          {
            id: sizeId,
            optionValue: sizeValue,
            variantId: variant.id,
            variantTitle: variant.title,
            sku: variant.sku ?? null,
            available: variant.availableForSale,
            price: variant.price,
          },
        ];
      });
      if (sizes.length === 0) return [];
      sizes.sort((a, b) => sizeIds.indexOf(a.id) - sizeIds.indexOf(b.id));
      const catalogColour = catalogColours.find((colour) => colour.id === id)!;
      return [
        {
          id,
          name: brand.store.colourNames[id],
          optionValue: value.name,
          // A stand-in's swatches are the wrong colours, so use our own.
          swatch:
            (standIn ? null : value.swatch?.color) ?? catalogColour.swatch,
          sizes,
          available: sizes.some((size) => size.available),
          price: sizes[0]!.price,
        },
      ];
    },
  );

  const order = catalogColours.map((colour) => colour.id);
  colours.sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));

  return {
    id: product.id,
    shopifyHandle: product.handle,
    title: product.title,
    vendor: product.vendor,
    standIn,
    colours,
  };
}

/** The variant that sells one colour in one size, if the product has it. */
export function heroVariant(
  hero: HeroProduct,
  colour: ColourId,
  size: SizeId | null,
): HeroSize | undefined {
  if (!size) return undefined;
  return hero.colours
    .find((candidate) => candidate.id === colour)
    ?.sizes.find((candidate) => candidate.id === size);
}
