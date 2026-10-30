import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { brand } from "~/content/brand";
import type { StorefrontShop } from "~/lib/storefront-shop";
import { cn } from "~/lib/utils";

import { PaymentMethodIcon } from "./PaymentMethodIcon";
import { POLICY_ITEMS, storePaths, type NavItem } from "./store/nav";
import { Wordmark } from "./store/Wordmark";

// The brand's footer columns, from the mock's StoreFooter.
const FOOTER_COLUMNS: { id: string; title: string; links: NavItem[] }[] = [
  {
    id: "shop",
    title: brand.store.nav.shop,
    links: [
      { to: storePaths.product, label: brand.store.products.sleeve.name },
      { to: storePaths.shop, label: "All collections" },
    ],
  },
  {
    id: "customer-care",
    title: "Customer care",
    links: [
      { to: storePaths.how, label: brand.store.nav.how },
      { to: storePaths.faq, label: "FAQ" },
      { to: storePaths.contact, label: "Contact" },
      { to: storePaths.search, label: "Search" },
      { to: storePaths.account, label: "Account" },
    ],
  },
  {
    id: "brand",
    title: brand.name,
    links: [
      { to: storePaths.about, label: brand.store.nav.about },
      { to: storePaths.journal, label: brand.store.nav.journal },
    ],
  },
];

function FooterLinks({ links }: { links: NavItem[] }) {
  return (
    <ul role="list" className="flex flex-col gap-1">
      {links.map((link) => (
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
  );
}

export function Footer({ shopInfo }: { shopInfo: StorefrontShop }) {
  const hasPaymentMethods = shopInfo.paymentMethods.length > 0;

  return (
    <footer className="mx-auto w-full max-w-7xl px-4">
      <Separator />
      <div
        className={cn(
          "grid grid-cols-1 gap-8 py-12 text-sm md:grid-cols-2 lg:grid-cols-4",
          hasPaymentMethods && "xl:grid-cols-5",
        )}
      >
        <div className="min-w-0 space-y-4 wrap-anywhere">
          <h2>
            <Wordmark />
          </h2>
          <p className="text-muted-foreground max-w-xs">{brand.tagline}</p>
        </div>
        {FOOTER_COLUMNS.map((column) => (
          <nav key={column.id} aria-labelledby={`footer-${column.id}-heading`}>
            <h2
              className="font-heading mb-4 font-medium"
              id={`footer-${column.id}-heading`}
            >
              {column.title}
            </h2>
            <FooterLinks links={column.links} />
          </nav>
        ))}
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
      <Separator />
      <nav aria-label="Policies" className="py-4 text-sm">
        <ul role="list" className="flex flex-wrap gap-x-6">
          {POLICY_ITEMS.map((link) => (
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
    </footer>
  );
}
