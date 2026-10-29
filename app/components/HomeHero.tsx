import { useState } from "react";
import { Link } from "react-router";

import { Button } from "~/components/ui/button";
import type { HomeHeroData } from "~/lib/home-hero";
import { cn } from "~/lib/utils";

export function HomeHero({ hero }: { hero: HomeHeroData }) {
  const [failedImageUrl, setFailedImageUrl] = useState<string | null>(null);
  const image =
    hero.image && hero.image.url !== failedImageUrl ? hero.image : null;

  return (
    <section
      className="mx-auto w-full max-w-7xl px-4"
      aria-labelledby="hero-heading"
    >
      <div className="bg-muted relative overflow-hidden rounded-xl">
        {image ? (
          <>
            <img
              src={image.url}
              alt={image.altText ?? ""}
              className="absolute inset-0 h-full w-full object-cover"
              loading="eager"
              fetchPriority="high"
              // An SSR image can fail before hydration attaches onError, so also check on mount.
              ref={(img) => {
                if (img?.complete && img.naturalWidth === 0)
                  setFailedImageUrl(image.url);
              }}
              onError={() => setFailedImageUrl(image.url)}
            />
            <div
              className="bg-foreground/60 pointer-events-none absolute inset-0"
              aria-hidden="true"
            />
          </>
        ) : null}
        <div
          className={cn(
            "relative z-10 flex flex-col items-start justify-end px-4",
            image
              ? "text-primary-foreground min-h-[60dvh] p-8 pb-12"
              : "py-16 md:py-20",
          )}
        >
          <h1
            id="hero-heading"
            className="font-heading max-w-2xl text-4xl font-semibold tracking-tight wrap-anywhere md:text-5xl"
          >
            {hero.heading}
          </h1>
          {hero.description ? (
            <p className="mt-3 max-w-prose text-lg wrap-anywhere whitespace-pre-line opacity-90">
              {hero.description}
            </p>
          ) : null}
          {/* Secondary reads against the dark image overlay; primary is near-black. */}
          <Button
            asChild
            variant={image ? "secondary" : "default"}
            className="mt-6 h-11 px-5"
          >
            <Link to={hero.to}>Shop now</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
