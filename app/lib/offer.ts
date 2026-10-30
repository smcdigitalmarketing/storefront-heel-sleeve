import { useRouteLoaderData } from "react-router";

import { brand } from "~/content/brand";
import { isOfferId, offers } from "~/content/offers";
import type { OfferId } from "~/content/types";

import type { Env } from "./env";

export const DEFAULT_OFFER: OfferId = "standard";

/**
 * The store runs one offer at a time, set by PUBLIC_ACTIVE_OFFER (an offer id
 * from content/offers.ts). In development, `?offer=<id>` previews another offer
 * on that request.
 */
export function resolveOfferId(
  env: Pick<Env, "PUBLIC_ACTIVE_OFFER">,
  request: Request,
): OfferId {
  if (import.meta.env.DEV) {
    const preview = new URL(request.url).searchParams.get("offer") ?? undefined;
    if (isOfferId(preview)) return preview;
  }
  return isOfferId(env.PUBLIC_ACTIVE_OFFER)
    ? env.PUBLIC_ACTIVE_OFFER
    : DEFAULT_OFFER;
}

/** The active offer id, from the root loader. */
export function useOfferId(): OfferId {
  const root = useRouteLoaderData("root") as { offerId?: OfferId } | undefined;
  return root?.offerId ?? DEFAULT_OFFER;
}

/** The active offer's prices and bundles, and the brand's copy for it. */
export function useOffer() {
  const id = useOfferId();
  return { id, offer: offers[id], copy: brand.offers[id] };
}
