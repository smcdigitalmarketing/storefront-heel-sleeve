import { SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { useCart } from "~/lib/cart";
import {
  CART_DRAWER_ID,
  SEARCH_DRAWER_ID,
  openDrawerFromLinkClick,
} from "~/lib/cart-drawer";
import type { StorefrontShop } from "~/lib/storefront-shop";

import { MobileNav, MobileNavTrigger } from "./MobileNav";

function cartCountLabel(count: number) {
  return count === 1 ? "Cart (1 item)" : `Cart (${count} items)`;
}

function liveCartCountLabel(count: number) {
  return count === 1 ? "1 item in cart" : `${count} items in cart`;
}

function displayCount(count: number) {
  return count > 99 ? "99+" : String(count);
}

export function Header({ shopInfo }: { shopInfo: StorefrontShop }) {
  const totalQuantity = useCart((state) => state.data.totalQuantity);
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);
  const logo = shopInfo.logo;

  return (
    <header className="bg-background sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2 pe-3 md:max-w-48 md:flex-none md:pe-0">
          <div className="-ms-2 md:hidden">
            <MobileNavTrigger />
          </div>
          <Link
            to="/"
            aria-label={shopInfo.name}
            title={shopInfo.name}
            className="font-heading focus-visible:ring-ring/50 inline-flex max-w-48 min-w-0 items-center rounded-md text-lg font-medium outline-none focus-visible:ring-3"
          >
            {logo && failedLogoUrl !== logo.url ? (
              <img
                src={logo.url}
                alt={logo.altText ?? shopInfo.name}
                width={logo.width ?? undefined}
                height={logo.height ?? undefined}
                className="h-auto max-h-10 w-auto max-w-full object-contain"
                // An SSR image can fail before hydration attaches onError, so also check on mount.
                ref={(img) => {
                  if (img?.complete && img.naturalWidth === 0)
                    setFailedLogoUrl(logo.url);
                }}
                onError={() => setFailedLogoUrl(logo.url)}
              />
            ) : (
              <span className="line-clamp-2 leading-tight wrap-anywhere">
                {shopInfo.name}
              </span>
            )}
          </Link>
        </div>

        <NavigationMenu
          aria-label="Main navigation"
          className="mx-8 hidden flex-1 md:flex"
        >
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink
                asChild
                className={navigationMenuTriggerStyle()}
              >
                <Link to="/collections">Collections</Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="flex shrink-0 items-center">
          <Button asChild variant="ghost" size="icon-lg">
            <Link
              to="/search"
              aria-label="Search"
              aria-controls={SEARCH_DRAWER_ID}
              aria-haspopup="dialog"
              data-testid="search-trigger"
              onClick={(event) =>
                openDrawerFromLinkClick(event, SEARCH_DRAWER_ID)
              }
            >
              <SearchIcon className="size-5" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon-lg">
            <Link to="/account" aria-label="Account">
              <UserIcon className="size-5" aria-hidden="true" />
            </Link>
          </Button>
          <Button asChild variant="ghost" size="icon-lg" className="relative">
            <Link
              to="/cart"
              aria-label={cartCountLabel(totalQuantity)}
              aria-controls={CART_DRAWER_ID}
              aria-haspopup="dialog"
              data-testid="cart-trigger"
              onClick={(event) =>
                openDrawerFromLinkClick(event, CART_DRAWER_ID)
              }
            >
              <ShoppingBagIcon className="size-5" aria-hidden="true" />
              {totalQuantity > 0 ? (
                <Badge
                  aria-hidden="true"
                  className="absolute -end-0.5 -top-0.5 min-w-5 px-1"
                >
                  {displayCount(totalQuantity)}
                </Badge>
              ) : null}
            </Link>
          </Button>
          <span aria-live="polite" aria-atomic="true" className="sr-only">
            {liveCartCountLabel(totalQuantity)}
          </span>
        </div>
      </div>
      <MobileNav />
    </header>
  );
}
