import { MenuIcon } from "lucide-react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
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
  useDrawer,
} from "~/lib/cart-drawer";

const NAV_LINKS = [{ to: "/collections", label: "Collections" }];

export function MobileNav() {
  const [open, setOpen] = useDrawer(MOBILE_NAV_DRAWER_ID);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        id={MOBILE_NAV_DRAWER_ID}
        side="left"
        className="w-full gap-0 sm:max-w-sm"
        data-testid="mobile-nav"
      >
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
          <SheetDescription className="sr-only">
            Browse the store
          </SheetDescription>
        </SheetHeader>
        <nav
          aria-label="Mobile navigation"
          className="flex-1 overflow-y-auto px-2 pb-4"
        >
          <ul role="list" className="flex flex-col">
            {NAV_LINKS.map((link) => (
              <li key={link.to}>
                <Button
                  asChild
                  variant="ghost"
                  size="lg"
                  className="h-11 w-full justify-start text-lg"
                >
                  <Link to={link.to} onClick={() => closeMobileNavDrawer()}>
                    {link.label}
                  </Link>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
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
