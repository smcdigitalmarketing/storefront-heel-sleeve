import { useEffect } from "react";
import { Link } from "react-router";

import { publishCartViewed } from "~/components/AnalyticsTrackers";
import {
  CartEmpty,
  CartErrorBanner,
  CartLineItem,
  CartTotals,
} from "~/components/CartDrawer";
import { FreeShippingBar } from "~/components/proof/FreeShippingBar";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { useCart } from "~/lib/cart";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/cart";

export function meta({ matches }: Route.MetaArgs) {
  return [
    { title: formatPageTitle("Cart", getShopNameFromRootMatch(matches[0])) },
  ];
}

export default function CartRoute() {
  const cart = useCart((state) => state.data);
  const loading = useCart((state) => state.loading);
  const totalsPending = useCart(
    (state) =>
      state.pending.cost === true ||
      ("revalidating" in state && state.revalidating === true),
  );
  const lines = cart.lines.nodes;

  useEffect(() => {
    publishCartViewed(cart);
  }, [cart]);

  return (
    <main
      id="main-content"
      tabIndex={-1}
      className="mx-auto w-full max-w-7xl flex-1 px-4 py-12"
    >
      <h1
        id="cart-page-title"
        tabIndex={-1}
        className="font-heading mb-8 text-4xl font-semibold tracking-tight md:text-5xl"
      >
        Cart
      </h1>
      <div className="flex flex-col gap-6">
        <CartErrorBanner />
        {loading ? (
          <p className="text-muted-foreground">Loading cart…</p>
        ) : null}
        {!loading && lines.length === 0 ? (
          <CartEmpty
            action={
              <Button asChild variant="outline" className="h-11 px-5">
                <Link to="/collections">Continue shopping</Link>
              </Button>
            }
          />
        ) : null}
        {lines.length > 0 ? (
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <ul role="list" className="divide-y">
              {lines.map((line) => (
                <CartLineItem
                  key={line.id}
                  line={line}
                  emptyCartFocusId="cart-page-title"
                />
              ))}
            </ul>
            <aside className="h-fit" aria-label="Cart summary">
              <Card size="sm">
                <CardContent className="flex flex-col gap-4">
                  <FreeShippingBar />
                  <CartTotals isPending={totalsPending} />
                </CardContent>
              </Card>
            </aside>
          </div>
        ) : null}
      </div>
    </main>
  );
}
