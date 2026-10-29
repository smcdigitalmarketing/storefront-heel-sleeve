import { useCallback, useSyncExternalStore } from "react";

export const CART_DRAWER_ID = "cart-drawer";
export const MOBILE_NAV_DRAWER_ID = "mobile-nav-drawer";
export const SEARCH_DRAWER_ID = "search-drawer";

export type DrawerId =
  typeof CART_DRAWER_ID | typeof MOBILE_NAV_DRAWER_ID | typeof SEARCH_DRAWER_ID;

// Which Sheet is open. It lives outside React so the product page and Shopify's
// `openCart` Standard Action can open the cart from anywhere, and opening one
// drawer closes the others.
let openId: DrawerId | null = null;
const listeners = new Set<() => void>();

let openCartActionConfigured = false;
let openCartActionRetryQueued = false;

function setOpenId(next: DrawerId | null): void {
  if (openId === next) return;
  openId = next;
  for (const listener of listeners) listener();
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Open state and setter for one drawer, shaped for a Sheet's `open` / `onOpenChange`. */
export function useDrawer(id: DrawerId): [boolean, (open: boolean) => void] {
  const open = useSyncExternalStore(
    subscribe,
    () => openId === id,
    () => false,
  );
  const setOpen = useCallback(
    (next: boolean) => (next ? openDrawer(id) : closeDrawer(id)),
    [id],
  );
  return [open, setOpen];
}

export function openDrawer(id: DrawerId): void {
  setOpenId(id);
}

export function closeDrawer(id: DrawerId): void {
  if (openId === id) setOpenId(null);
}

export function openCartDrawer(): void {
  openDrawer(CART_DRAWER_ID);
}

export function closeCartDrawer(): void {
  closeDrawer(CART_DRAWER_ID);
}

export function openMobileNavDrawer(): void {
  openDrawer(MOBILE_NAV_DRAWER_ID);
}

export function closeMobileNavDrawer(): void {
  closeDrawer(MOBILE_NAV_DRAWER_ID);
}

export function openSearchDrawer(): void {
  openDrawer(SEARCH_DRAWER_ID);
}

export function closeSearchDrawer(): void {
  closeDrawer(SEARCH_DRAWER_ID);
}

type LinkClick = Pick<
  MouseEvent,
  "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey"
> & {
  preventDefault(): void;
};

// Only a plain left click opens the drawer, so the href still works without
// JavaScript and for open-in-new-tab clicks.
export function openDrawerFromLinkClick(event: LinkClick, id: DrawerId): void {
  const isModifiedClick =
    event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
  if (event.button !== 0 || isModifiedClick) return;
  event.preventDefault();
  openDrawer(id);
}

function configureOpenCartActionNow(): boolean {
  const openCart =
    typeof window !== "undefined"
      ? window.Shopify?.actions?.openCart
      : undefined;
  if (!openCart) return false;

  openCart.configure({
    handler: async () => openCartDrawer(),
  });
  openCartActionConfigured = true;
  return true;
}

export function configureOpenCartAction(): void {
  if (typeof document === "undefined" || openCartActionConfigured) return;
  if (configureOpenCartActionNow()) return;
  if (openCartActionRetryQueued || document.readyState !== "loading") return;

  openCartActionRetryQueued = true;
  document.addEventListener(
    "DOMContentLoaded",
    () => {
      openCartActionRetryQueued = false;
      configureOpenCartAction();
    },
    { once: true },
  );
}

configureOpenCartAction();
