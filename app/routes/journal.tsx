import { ArticleCard, journalArticles } from "~/components/store/ArticleCard";
import { PageTitle } from "~/components/store/PageTitle";
import { brand } from "~/content/brand";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/journal";

export function meta({ matches }: Route.MetaArgs) {
  return [
    {
      title: formatPageTitle(
        brand.store.nav.journal,
        getShopNameFromRootMatch(matches[0]),
      ),
    },
    { name: "description", content: brand.store.home.journalHeadline },
  ];
}

export default function Journal() {
  return (
    <main className="flex-1 pb-24" id="main-content" tabIndex={-1}>
      <PageTitle
        eyebrow={brand.store.nav.journal}
        title={brand.store.home.journalHeadline}
      />
      <ul
        role="list"
        className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 md:grid-cols-2"
      >
        {journalArticles.map((article) => (
          <li key={article.to}>
            <ArticleCard article={article} large />
          </li>
        ))}
      </ul>
    </main>
  );
}
