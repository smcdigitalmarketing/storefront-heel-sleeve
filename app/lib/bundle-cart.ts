import type { CartLineInput } from "~/standard-actions";

/** Hidden line attributes (a leading "_" keeps them out of the cart UI). */
export const BUNDLE_ATTRIBUTE = "_bundle";
export const OFFER_ATTRIBUTE = "_offer";

/**
 * One cart line per variant in the bundle, with quantities merged ("4 sleeves:
 * Night M, Night M, Royal M, Night L" is 3 lines). Every line carries the same bundle tag, so the
 * order shows which copies were bought together.
 */
export function bundleLines(
  variantIds: string[],
  { bundleId, offerId }: { bundleId: string; offerId: string },
): CartLineInput[] {
  const tag = `${bundleId}-${crypto.randomUUID().slice(0, 8)}`;
  const quantities = new Map<string, number>();
  for (const id of variantIds)
    quantities.set(id, (quantities.get(id) ?? 0) + 1);
  return [...quantities].map(([merchandiseId, quantity]) => ({
    merchandiseId,
    quantity,
    attributes: [
      { key: BUNDLE_ATTRIBUTE, value: tag },
      { key: OFFER_ATTRIBUTE, value: offerId },
    ],
  }));
}

/** True once Hydrogen's cart store handles `updateCart` (after hydration). */
export function canUpdateCart(): boolean {
  const updateCart =
    typeof window !== "undefined"
      ? window.Shopify?.actions?.updateCart
      : undefined;
  return Boolean(updateCart && !updateCart.isDefault());
}

/**
 * Waits up to `timeoutMs` for the cart store to take over `updateCart`. Right
 * after hydration (or a dev-server reload) it can lag behind React by a moment.
 */
export async function waitForUpdateCart(timeoutMs = 3000): Promise<boolean> {
  const deadline = Date.now() + timeoutMs;
  while (!canUpdateCart()) {
    if (Date.now() > deadline) return false;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  return true;
}

/**
 * Adds several lines through Shopify's Standard Actions, following the
 * hydrogen-cart-ui rules: adds batch in one call, but with no cart yet the
 * first add goes alone and settles first, or a second cart would be created.
 */
export async function addLinesToCart(
  lines: CartLineInput[],
  { hasCart }: { hasCart: boolean },
) {
  const updateCart = window.Shopify!.actions!.updateCart;
  if (lines.length === 0) return;
  if (!hasCart) {
    await updateCart({ lines: [lines[0]!] });
    if (lines.length > 1) await updateCart({ lines: lines.slice(1) });
    return;
  }
  await updateCart({ lines });
}
