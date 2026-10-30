import { AdvertorialArticle } from "~/components/store/Advertorial";
import { GuideArticle } from "~/components/store/GuideArticle";
import { GUIDE_SLUG } from "~/components/store/nav";
import { brand } from "~/content/brand";
import { guideArticle } from "~/content/store-pages";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/journal-article";

const ARTICLES = {
  [brand.advertorialSlug]: {
    title: brand.advertorial.headline,
    description: brand.advertorial.dek,
  },
  [GUIDE_SLUG]: {
    title: guideArticle.headline,
    description: guideArticle.dek,
  },
} as Record<string, { title: string; description: string } | undefined>;

export function loader({ params }: Route.LoaderArgs) {
  if (!ARTICLES[params.slug]) throw new Response("Not Found", { status: 404 });
  return { slug: params.slug };
}

export function meta({ matches, params }: Route.MetaArgs) {
  const article = ARTICLES[params.slug];
  return [
    {
      title: formatPageTitle(
        article?.title ?? "Not found",
        getShopNameFromRootMatch(matches[0]),
      ),
    },
    ...(article ? [{ name: "description", content: article.description }] : []),
  ];
}

export default function JournalArticle({ loaderData }: Route.ComponentProps) {
  return (
    <main className="flex-1" id="main-content" tabIndex={-1}>
      {loaderData.slug === brand.advertorialSlug ? (
        <AdvertorialArticle />
      ) : (
        <GuideArticle />
      )}
    </main>
  );
}
