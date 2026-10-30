import { Home } from "~/components/store/Home";
import { brand } from "~/content/brand";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/home";

export function meta({ matches }: Route.MetaArgs) {
  return [
    {
      title: formatPageTitle(
        brand.tagline,
        getShopNameFromRootMatch(matches[0]),
      ),
    },
    { name: "description", content: brand.positioning },
  ];
}

// Every section reads brand content, so the home needs no Storefront API data.
export default function HomeRoute() {
  return (
    <main className="flex-1" id="main-content" tabIndex={-1}>
      <Home />
    </main>
  );
}
