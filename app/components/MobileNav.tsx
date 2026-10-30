import { MenuIcon } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/sheet";
import {
  MOBILE_NAV_DRAWER_ID,
  closeMobileNavDrawer,
  openMobileNavDrawer,
  returnFocusOnClose,
  useDrawer,
} from "~/lib/cart-drawer";

import { HELP_ITEMS, NAV_ITEMS, type NavItem } from "./store/nav";
import { Wordmark } from "./store/Wordmark";

function NavList({
  items,
  label,
  size,
}: {
  items: NavItem[];
  label: string;
  size: "lg" | "md";
}) {
  return (
    <nav aria-label={label} className="px-2 py-2">
      <ul role="list" className="flex flex-col">
        {items.map((link) => (
          <li key={link.to}>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className={
                size === "lg"
                  ? "font-heading h-12 w-full justify-start text-xl font-bold"
                  : "h-11 w-full justify-start text-base font-normal"
              }
            >
              <Link to={link.to} onClick={() => closeMobileNavDrawer()}>
                {link.label}
              </Link>
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function MobileNav() {
  const [open, setOpen] = useDrawer(MOBILE_NAV_DRAWER_ID);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        id={MOBILE_NAV_DRAWER_ID}
        side="left"
        className="w-full gap-0 sm:max-w-sm"
        data-testid="mobile-nav"
        onCloseAutoFocus={returnFocusOnClose}
      >
        <SheetHeader className="border-b">
          <SheetTitle className="sr-only">Menu</SheetTitle>
          <Wordmark />
          <SheetDescription className="sr-only">
            Browse the store
          </SheetDescription>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto pb-4">
          <NavList items={NAV_ITEMS} label="Mobile navigation" size="lg" />
          <Separator />
          <NavList items={HELP_ITEMS} label="Help" size="md" />
        </div>
      </SheetContent>
    </Sheet>
  );
}

export function MobileNavTrigger() {
  return (
    <Button
      variant="ghost"
      size="icon-lg"
      aria-label="Menu"
      aria-controls={MOBILE_NAV_DRAWER_ID}
      aria-haspopup="dialog"
      data-testid="nav-trigger"
      onClick={() => openMobileNavDrawer()}
    >
      <MenuIcon className="size-5" aria-hidden="true" />
    </Button>
  );
}
