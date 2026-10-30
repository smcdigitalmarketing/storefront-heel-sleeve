import { PlaceholderTag } from "~/components/brand/PlaceholderTag";
import { isPolicySlug } from "~/components/store/nav";
import { PageTitle } from "~/components/store/PageTitle";
import { policies } from "~/content/store-pages";
import {
  formatPageTitle,
  getShopNameFromRootMatch,
} from "~/lib/storefront-shop";

import type { Route } from "./+types/policy";

export function loader({ params }: Route.LoaderArgs) {
  if (!isPolicySlug(params.policy)) {
    throw new Response("Not Found", { status: 404 });
  }
  return { policy: params.policy };
}

export function meta({ matches, params }: Route.MetaArgs) {
  const page = isPolicySlug(params.policy) ? policies[params.policy] : null;
  return [
    {
      title: formatPageTitle(
        page?.title ?? "Not found",
        getShopNameFromRootMatch(matches[0]),
      ),
    },
    ...(page ? [{ name: "description", content: page.intro }] : []),
  ];
}

export default function Policy({ loaderData }: Route.ComponentProps) {
  const page = policies[loaderData.policy];
  return (
    <main className="flex-1 pb-24" id="main-content" tabIndex={-1}>
      <PageTitle eyebrow="Policies" title={page.title} intro={page.intro} />
      <div className="mx-auto max-w-3xl space-y-8 px-4 sm:px-6">
        {page.sections.map((section) => (
          <section
            key={section.heading}
            className="border-foreground/20 space-y-2 border-t pt-6"
          >
            <h2 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
              {section.heading}
              {section.status === "tbc" ? <PlaceholderTag kind="tbc" /> : null}
            </h2>
            <p className="text-muted-foreground text-lg">{section.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
