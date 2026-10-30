import { Link } from "react-router";

import { Img } from "~/components/brand/Img";
import { brand } from "~/content/brand";
import type { ImageId } from "~/content/images";
import { guideArticle } from "~/content/store-pages";
import { cn } from "~/lib/utils";

import { storePaths } from "./nav";

export type JournalArticle = {
  to: string;
  kicker: string;
  title: string;
  dek: string;
  image: ImageId;
  readTime: string;
};

/** The journal's two articles: the advertorial and the photo-transfer guide. */
export const journalArticles: JournalArticle[] = [
  {
    to: storePaths.advertorial,
    kicker: brand.advertorial.kicker,
    title: brand.advertorial.headline,
    dek: brand.advertorial.dek,
    image: brand.advertorial.leadImage,
    readTime: brand.advertorial.readTime,
  },
  {
    to: storePaths.guide,
    kicker: guideArticle.kicker,
    title: guideArticle.headline,
    dek: guideArticle.dek,
    image: guideArticle.image,
    readTime: guideArticle.readTime,
  },
];

export function ArticleCard({
  article,
  large = false,
}: {
  article: JournalArticle;
  large?: boolean;
}) {
  return (
    <Link
      to={article.to}
      className="group bg-card text-card-foreground focus-visible:ring-ring/50 border-foreground block border-2 p-2 outline-none focus-visible:ring-3"
    >
      <div className="overflow-hidden">
        <Img
          image={article.image}
          sizes="(min-width: 1024px) 50vw, 100vw"
          className={cn(
            "w-full object-cover transition duration-700 motion-safe:group-hover:scale-105",
            large ? "aspect-[16/10]" : "aspect-[4/3]",
          )}
        />
      </div>
      <div className="space-y-2 px-2 pt-4 pb-2">
        <p className="text-muted-foreground text-xs">
          {article.kicker} · {article.readTime}
        </p>
        <h2
          className={cn(
            "font-heading text-2xl leading-tight font-extrabold uppercase italic group-hover:underline",
            large && "sm:text-3xl",
          )}
        >
          {article.title}
        </h2>
        <p className="text-muted-foreground">{article.dek}</p>
      </div>
    </Link>
  );
}
