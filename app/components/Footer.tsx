import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import type { StorefrontShop } from "~/lib/storefront-shop";
import { cn } from "~/lib/utils";

import { PaymentMethodIcon } from "./PaymentMethodIcon";

const FOOTER_LINKS = [
  { to: "/search", label: "Search" },
  { to: "/account", label: "Account" },
];

export function Footer({ shopInfo }: { shopInfo: StorefrontShop }) {
  const hasPaymentMethods = shopInfo.paymentMethods.length > 0;

  return (
    <footer className="mx-auto w-full max-w-7xl px-4">
      <Separator />
      <div
        className={cn(
          "grid grid-cols-1 gap-8 py-12 text-sm md:grid-cols-2",
          hasPaymentMethods && "lg:grid-cols-3",
        )}
      >
        <div className="min-w-0 wrap-anywhere">
          <h2 className="font-heading mb-4 font-medium">{shopInfo.name}</h2>
        </div>
        <nav aria-labelledby="footer-customer-care-heading">
          <h2
            className="font-heading mb-4 font-medium"
            id="footer-customer-care-heading"
          >
            Customer care
          </h2>
          <ul role="list" className="flex flex-col gap-1">
            {FOOTER_LINKS.map((link) => (
              <li key={link.to}>
                <Button
                  asChild
                  variant="link"
                  className="text-muted-foreground h-11 px-0"
                >
                  <Link to={link.to}>{link.label}</Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
        {hasPaymentMethods ? (
          <div>
            <h2
              id="footer-payment-methods-heading"
              className="font-heading mb-4 font-medium"
            >
              Payment methods
            </h2>
            <ul
              role="list"
              aria-labelledby="footer-payment-methods-heading"
              className="flex flex-wrap items-center gap-2"
            >
              {shopInfo.paymentMethods.map((method) => (
                <li key={method} className="max-w-full">
                  <PaymentMethodIcon method={method} />
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </footer>
  );
}
