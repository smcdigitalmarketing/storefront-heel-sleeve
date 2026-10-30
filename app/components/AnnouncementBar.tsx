import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router";

import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { useOffer } from "~/lib/offer";
import { cn } from "~/lib/utils";

import { PRODUCT_PATH } from "./store/nav";

/** The active offer's banner (the mock's PromoBanner), linking to the sleeve. */
export function AnnouncementBar() {
  const { id, copy } = useOffer();
  const blackFriday = id === "black-friday";

  return (
    <div
      role="region"
      aria-label="Announcement"
      data-offer={id}
      className={cn(
        "relative overflow-hidden text-center text-sm",
        blackFriday
          ? "bg-foreground text-secondary"
          : "bg-secondary text-secondary-foreground",
      )}
    >
      <div className="mx-auto flex min-h-11 max-w-7xl flex-wrap items-center justify-center gap-x-3 gap-y-0 px-4 pb-1 sm:pb-0">
        <Link
          to={PRODUCT_PATH}
          className="font-heading inline-flex min-h-11 items-center gap-2 font-bold wrap-anywhere underline-offset-4 hover:underline"
        >
          {copy.banner}
          <ArrowRightIcon className="size-4 shrink-0" aria-hidden="true" />
        </Link>
        <PlaceholderTag kind="illustrative" label="Illustrative offer" />
      </div>
    </div>
  );
}
