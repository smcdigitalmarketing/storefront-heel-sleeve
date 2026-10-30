import { AnalyticsEvent } from "@shopify/hydrogen";
import { useEffect } from "react";

import { ProductPage } from "~/components/pdp/ProductPage";
import { brand } from "~/content/brand";
import { envContext } from "~/lib/env";
import {
  HERO_PRODUCT_QUERY,
  heroQueryHandle,
  toHeroProduct,
  type HeroProduct,
} from "~/lib/hero-product";
import { shouldUseMockShop } from "~/lib/shop";
import { storefrontClientContext } from "~/lib/storefront";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/hero-product";

export function meta({ matches }: Route.MetaArgs) {
  return [
    {
      title: formatPageTitle(
        brand.productName,
        getShopNameFromRootMatch(matches[0]),
      ),
    },
    { name: "description", content: brand.pdp.subheadline },
  ];
}

export async function loader({ context }: Route.LoaderArgs) {
  const env = context.get(envContext);
  const storefrontClient = context.get(storefrontClientContext);
  // No Shopify store is linked while we build, so mock.shop supplies a stand-in.
  const standIn = shouldUseMockShop(env);
  const { data } = await storefrontClient.graphql(HERO_PRODUCT_QUERY, {
    variables: { handle: heroQueryHandle(standIn) },
  });

  if (!data?.product) throw new Response("Not Found", { status: 404 });

  return { hero: toHeroProduct(data.product, standIn) };
}

function HeroViewedTracker({ hero }: { hero: HeroProduct }) {
  useEffect(() => {
    const colour =
      hero.colours.find((candidate) => candidate.available) ?? hero.colours[0];
    const variant =
      colour?.sizes.find((size) => size.available) ?? colour?.sizes[0];
    if (!variant) return;
    window.Shopify?.analytics?.publish(AnalyticsEvent.PRODUCT_VIEWED, {
      products: [
        {
          id: hero.id,
          title: hero.title,
          price: variant.price,
          vendor: hero.vendor,
          variantId: variant.variantId,
          variantTitle: variant.variantTitle,
          quantity: 1,
          sku: variant.sku ?? undefined,
        },
      ],
    });
  }, [hero]);

  return null;
}

export default function HeroProductRoute({ loaderData }: Route.ComponentProps) {
  const { hero } = loaderData;

  return (
    // pb-24 keeps the sticky add-to-cart bar from covering the end of the page.
    <main className="flex-1 pb-24" id="main-content" tabIndex={-1}>
      <HeroViewedTracker hero={hero} />
      <ProductPage hero={hero} />
    </main>
  );
}
