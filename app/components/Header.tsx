import { SearchIcon, ShoppingBagIcon, UserIcon } from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useRouteLoaderData } from "react-router";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import { brand } from "~/content/brand";
import { useCart } from "~/lib/cart";
import {
  CART_DRAWER_ID,
  SEARCH_DRAWER_ID,
  openDrawerFromLinkClick,
} from "~/lib/cart-drawer";
import { isMockShopDomain } from "~/lib/shop";
import type { StorefrontShop } from "~/lib/storefront-shop";
import { cn } from "~/lib/utils";
import type { loader as rootLoader } from "~/root";

import { MobileNav, MobileNavTrigger } from "./MobileNav";
import { NAV_ITEMS, type NavItem } from "./store/nav";
import { Wordmark } from "./store/Wordmark";

function cartCountLabel(count: number) {
  return count === 1 ? "Cart (1 item)" : `Cart (${count} items)`;
}

function liveCartCountLabel(count: number) {
  return count === 1 ? "1 item in cart" : `${count} items in cart`;
}

function displayCount(count: number) {
  return count > 99 ? "99+" : String(count);
}

// Flashpop's header is centred: three links, the wordmark, two links and the icons.
const LEFT_NAV = NAV_ITEMS.slice(0, 3);
const RIGHT_NAV = NAV_ITEMS.slice(3);

function HeaderNav({ items, label }: { items: NavItem[]; label: string }) {
  return (
    <NavigationMenu aria-label={label} className="hidden flex-none lg:flex">
      <NavigationMenuList>
        {items.map((item) => (
          <NavigationMenuItem key={item.to}>
            <NavigationMenuLink
              asChild
              className={cn(
                navigationMenuTriggerStyle(),
                "h-11 bg-transparent font-medium whitespace-nowrap underline-offset-[6px] hover:underline aria-[current=page]:underline",
              )}
            >
              <NavLink to={item.to}>{item.label}</NavLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export function Header({ shopInfo }: { shopInfo: StorefrontShop }) {
  const totalQuantity = useCart((state) => state.data.totalQuantity);
  const [failedLogoUrl, setFailedLogoUrl] = useState<string | null>(null);
  const rootData = useRouteLoaderData<typeof rootLoader>("root");
  // mock.shop's logo belongs to the stand-in catalog, not to Flashpop.
  const standIn = isMockShopDomain(
    rootData?.shopIdentity.scriptShop.myshopifyDomain,
  );
  const logo = standIn ? null : shopInfo.logo;
  const showLogo = Boolean(logo && failedLogoUrl !== logo.url);
  const homeLabel = showLogo ? shopInfo.name : brand.name;

  return (
    <header className="bg-background sticky top-0 z-40 border-b">
      <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-2 px-4">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="-ms-2 lg:hidden">
            <MobileNavTrigger />
          </div>
          <HeaderNav items={LEFT_NAV} label="Main navigation" />
        </div>

        <Link
          to="/"
          aria-label={homeLabel}
          title={homeLabel}
          className="focus-visible:ring-ring/50 inline-flex max-w-48 min-w-0 shrink-0 items-center rounded-md outline-none focus-visible:ring-3"
        >
          {logo && showLogo ? (
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
            <Wordmark className="text-xl sm:text-2xl" />
          )}
        </Link>

        <div className="flex flex-1 items-center justify-end gap-2">
          <HeaderNav items={RIGHT_NAV} label="More navigation" />
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
      </div>
      <MobileNav />
    </header>
  );
}
