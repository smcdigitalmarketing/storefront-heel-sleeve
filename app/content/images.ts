// Image registry. Every <img> of brand imagery resolves through here, so
// swapping a stand-in for final photography never touches a component.
// Generated once from the retro-camera mock (apps/recoverx: scripts/image-slots.ts
// and content/image-status.json); files are served from public/images/sleeve.
// Image generation was skipped in the mock, so every image is a
// "competitor-original": a competitor stand-in that must be labelled where
// shown. All of them are replaced by a shoot of our own sleeve before launch.

export type ImageStatus = "generated" | "competitor-original";

export type SiteImage = {
  id: string;
  src: string;
  srcSet: string;
  width: number;
  height: number;
  alt: string;
  status: ImageStatus;
  /** Competitor assets the image was made from (the mock's asset-sources.ts ids). */
  from: string[];
};

export const images = {
  "product-thumb": {
    id: "product-thumb",
    src: "/images/sleeve/product/thumb.webp",
    srcSet: "/images/sleeve/product/thumb.webp 800w",
    width: 800,
    height: 800,
    alt: "The black heel sleeve on a grey display foot, side view",
    status: "competitor-original",
    from: ["product-black"],
  },
  "colour-blue-thumb": {
    id: "colour-blue-thumb",
    src: "/images/sleeve/product/thumb-blue.webp",
    srcSet: "/images/sleeve/product/thumb-blue.webp 800w",
    width: 800,
    height: 800,
    alt: "The heel sleeve with blue trim, side view",
    status: "competitor-original",
    from: ["product-blue"],
  },
  "colour-green-thumb": {
    id: "colour-green-thumb",
    src: "/images/sleeve/product/thumb-green.webp",
    srcSet: "/images/sleeve/product/thumb-green.webp 800w",
    width: 800,
    height: 800,
    alt: "The heel sleeve with green trim, side view",
    status: "competitor-original",
    from: ["product-green"],
  },
  "colour-red-thumb": {
    id: "colour-red-thumb",
    src: "/images/sleeve/product/thumb-red.webp",
    srcSet: "/images/sleeve/product/thumb-red.webp 800w",
    width: 800,
    height: 800,
    alt: "The heel sleeve with red trim, side view",
    status: "competitor-original",
    from: ["product-red"],
  },
  "product-studio": {
    id: "product-studio",
    src: "/images/sleeve/product/studio.webp",
    srcSet:
      "/images/sleeve/product/studio-800.webp 800w, /images/sleeve/product/studio.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "The black heel sleeve on a display foot, three-quarter view",
    status: "competitor-original",
    from: ["product-alone"],
  },
  "colour-blue-studio": {
    id: "colour-blue-studio",
    src: "/images/sleeve/product/studio-blue.webp",
    srcSet:
      "/images/sleeve/product/studio-blue-800.webp 800w, /images/sleeve/product/studio-blue.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "The blue-trim heel sleeve on a pale blue backdrop",
    status: "competitor-original",
    from: ["product-blue"],
  },
  "colour-green-studio": {
    id: "colour-green-studio",
    src: "/images/sleeve/product/studio-green.webp",
    srcSet:
      "/images/sleeve/product/studio-green-800.webp 800w, /images/sleeve/product/studio-green.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "The green-trim heel sleeve on a pale sage backdrop",
    status: "competitor-original",
    from: ["product-green"],
  },
  "colour-red-studio": {
    id: "colour-red-studio",
    src: "/images/sleeve/product/studio-red.webp",
    srcSet:
      "/images/sleeve/product/studio-red-800.webp 800w, /images/sleeve/product/studio-red.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "The red-trim heel sleeve on a pale blush backdrop",
    status: "competitor-original",
    from: ["product-red"],
  },
  "colour-lineup": {
    id: "colour-lineup",
    src: "/images/sleeve/product/lineup.webp",
    srcSet:
      "/images/sleeve/product/lineup-800.webp 800w, /images/sleeve/product/lineup.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "The heel sleeve in all four colours, side by side",
    status: "competitor-original",
    from: ["product-pair"],
  },
  "pair-pack": {
    id: "pair-pack",
    src: "/images/sleeve/product/pair.webp",
    srcSet: "/images/sleeve/product/pair.webp 800w",
    width: 800,
    height: 800,
    alt: "A pair of black heel sleeves",
    status: "competitor-original",
    from: ["product-pair"],
  },
  "gallery-benefit": {
    id: "gallery-benefit",
    src: "/images/sleeve/lifestyle/benefit-run.webp",
    srcSet:
      "/images/sleeve/lifestyle/benefit-run-800.webp 800w, /images/sleeve/lifestyle/benefit-run.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "A boy sprinting across a soccer field wearing the sleeve",
    status: "competitor-original",
    from: ["life-track"],
  },
  "gallery-in-use": {
    id: "gallery-in-use",
    src: "/images/sleeve/lifestyle/sideline-fit.webp",
    srcSet:
      "/images/sleeve/lifestyle/sideline-fit-800.webp 800w, /images/sleeve/lifestyle/sideline-fit.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "A parent helping a girl fasten the sleeve's strap on the sideline",
    status: "competitor-original",
    from: ["life-mom-sideline"],
  },
  "compare-without": {
    id: "compare-without",
    src: "/images/sleeve/lifestyle/bench-without.webp",
    srcSet:
      "/images/sleeve/lifestyle/bench-without-800.webp 800w, /images/sleeve/lifestyle/bench-without.webp 1600w",
    width: 1600,
    height: 2000,
    alt: "A child's ankles in socks before practice, no sleeve",
    status: "competitor-original",
    from: ["adv-muddy-cleats"],
  },
  "compare-with": {
    id: "compare-with",
    src: "/images/sleeve/lifestyle/bench-with.webp",
    srcSet:
      "/images/sleeve/lifestyle/bench-with-800.webp 800w, /images/sleeve/lifestyle/bench-with.webp 1600w",
    width: 1600,
    height: 2000,
    alt: "The same child wearing the sleeve on both ankles",
    status: "competitor-original",
    from: ["step-lace"],
  },
  "gallery-included": {
    id: "gallery-included",
    src: "/images/sleeve/product/whats-included.webp",
    srcSet:
      "/images/sleeve/product/whats-included-800.webp 800w, /images/sleeve/product/whats-included.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "Two sleeves with straps open, a sizing card and a parent guide",
    status: "competitor-original",
    from: ["product-pair"],
  },
  "step-on": {
    id: "step-on",
    src: "/images/sleeve/product/step-on.webp",
    srcSet:
      "/images/sleeve/product/step-on-800.webp 800w, /images/sleeve/product/step-on.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "Hands pulling the sleeve over a child's heel",
    status: "competitor-original",
    from: ["step-pull-on"],
  },
  "step-strap": {
    id: "step-strap",
    src: "/images/sleeve/product/step-strap.webp",
    srcSet:
      "/images/sleeve/product/step-strap-800.webp 800w, /images/sleeve/product/step-strap.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "Hands wrapping the strap around the ankle in a figure-8",
    status: "competitor-original",
    from: ["step-wrap"],
  },
  "step-lace": {
    id: "step-lace",
    src: "/images/sleeve/product/step-lace.webp",
    srcSet:
      "/images/sleeve/product/step-lace-800.webp 800w, /images/sleeve/product/step-lace.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "A child lacing a cleat over the sleeve",
    status: "competitor-original",
    from: ["step-lace"],
  },
  "life-soccer": {
    id: "life-soccer",
    src: "/images/sleeve/lifestyle/soccer.webp",
    srcSet:
      "/images/sleeve/lifestyle/soccer-800.webp 800w, /images/sleeve/lifestyle/soccer.webp 1600w",
    width: 1600,
    height: 2000,
    alt: "A girl dribbling a soccer ball wearing the sleeve",
    status: "competitor-original",
    from: ["life-soccer-dribble"],
  },
  "life-basketball": {
    id: "life-basketball",
    src: "/images/sleeve/lifestyle/basketball.webp",
    srcSet:
      "/images/sleeve/lifestyle/basketball-800.webp 800w, /images/sleeve/lifestyle/basketball.webp 1600w",
    width: 1600,
    height: 2000,
    alt: "A boy making a cut on a basketball court",
    status: "competitor-original",
    from: ["life-basketball-cut"],
  },
  "life-gymnastics": {
    id: "life-gymnastics",
    src: "/images/sleeve/lifestyle/gymnastics.webp",
    srcSet:
      "/images/sleeve/lifestyle/gymnastics-800.webp 800w, /images/sleeve/lifestyle/gymnastics.webp 1600w",
    width: 1600,
    height: 2000,
    alt: "A girl on a practice beam wearing the sleeve",
    status: "competitor-original",
    from: ["life-gymnast-beam"],
  },
  "life-sideline": {
    id: "life-sideline",
    src: "/images/sleeve/lifestyle/sideline.webp",
    srcSet:
      "/images/sleeve/lifestyle/sideline-800.webp 800w, /images/sleeve/lifestyle/sideline.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "A dad and his son laughing on the bleachers after practice",
    status: "competitor-original",
    from: ["life-dad-bench"],
  },
  "life-kitbag": {
    id: "life-kitbag",
    src: "/images/sleeve/lifestyle/kit-bag.webp",
    srcSet:
      "/images/sleeve/lifestyle/kit-bag-800.webp 800w, /images/sleeve/lifestyle/kit-bag.webp 1600w",
    width: 1600,
    height: 2000,
    alt: "A pair of sleeves packed in a kit bag with shin guards",
    status: "competitor-original",
    from: ["product-pair"],
  },
  "hero-rally": {
    id: "hero-rally",
    src: "/images/sleeve/heroes/rally.webp",
    srcSet:
      "/images/sleeve/heroes/rally-800.webp 800w, /images/sleeve/heroes/rally.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "A boy driving to the basket in a youth basketball game",
    status: "competitor-original",
    from: ["life-basketball-gym"],
  },
  "knee-sleeve": {
    id: "knee-sleeve",
    src: "/images/sleeve/accessories/knee-sleeve.webp",
    srcSet: "/images/sleeve/accessories/knee-sleeve.webp 800w",
    width: 800,
    height: 800,
    alt: "A black knitted knee sleeve",
    status: "competitor-original",
    from: ["product-alone"],
  },
  "wash-bag": {
    id: "wash-bag",
    src: "/images/sleeve/accessories/wash-bag.webp",
    srcSet: "/images/sleeve/accessories/wash-bag.webp 800w",
    width: 800,
    height: 800,
    alt: "A white mesh wash bag",
    status: "competitor-original",
    from: ["product-pair"],
  },
  "kit-flatlay": {
    id: "kit-flatlay",
    src: "/images/sleeve/accessories/game-day-kit.webp",
    srcSet:
      "/images/sleeve/accessories/game-day-kit-800.webp 800w, /images/sleeve/accessories/game-day-kit.webp 1600w",
    width: 1600,
    height: 1600,
    alt: "Game-day kit: two sleeves, a wash bag and a sizing card",
    status: "competitor-original",
    from: ["product-pair"],
  },
  "adv-lead": {
    id: "adv-lead",
    src: "/images/sleeve/advertorial/mudroom.webp",
    srcSet:
      "/images/sleeve/advertorial/mudroom-800.webp 800w, /images/sleeve/advertorial/mudroom.webp 1600w",
    width: 1600,
    height: 1067,
    alt: "Muddy cleats and folded sleeves on a mudroom bench",
    status: "competitor-original",
    from: ["adv-muddy-cleats"],
  },
  "strip-01": {
    id: "strip-01",
    src: "/images/sleeve/strip/gymnast-cartwheel.webp",
    srcSet:
      "/images/sleeve/strip/gymnast-cartwheel-800.webp 800w, /images/sleeve/strip/gymnast-cartwheel.webp 1200w",
    width: 1200,
    height: 960,
    alt: "A girl mid-cartwheel on a gym mat",
    status: "competitor-original",
    from: ["life-gymnast-cartwheel"],
  },
  "strip-02": {
    id: "strip-02",
    src: "/images/sleeve/strip/dance.webp",
    srcSet:
      "/images/sleeve/strip/dance-800.webp 800w, /images/sleeve/strip/dance.webp 1200w",
    width: 1200,
    height: 900,
    alt: "A girl dancing in a studio",
    status: "competitor-original",
    from: ["life-dance"],
  },
  "strip-03": {
    id: "strip-03",
    src: "/images/sleeve/strip/soccer-match.webp",
    srcSet:
      "/images/sleeve/strip/soccer-match-800.webp 800w, /images/sleeve/strip/soccer-match.webp 1100w",
    width: 1100,
    height: 641,
    alt: "Two boys chasing the ball in a youth soccer match",
    status: "competitor-original",
    from: ["life-soccer-match"],
  },
  "strip-04": {
    id: "strip-04",
    src: "/images/sleeve/strip/basketball-girl.webp",
    srcSet:
      "/images/sleeve/strip/basketball-girl-800.webp 800w, /images/sleeve/strip/basketball-girl.webp 1200w",
    width: 1200,
    height: 1200,
    alt: "A girl dribbling on an outdoor court at sunset",
    status: "competitor-original",
    from: ["life-basketball-girl"],
  },
  "strip-05": {
    id: "strip-05",
    src: "/images/sleeve/strip/teen-juggle.webp",
    srcSet:
      "/images/sleeve/strip/teen-juggle-800.webp 800w, /images/sleeve/strip/teen-juggle.webp 960w",
    width: 960,
    height: 1200,
    alt: "A teenager juggling a soccer ball",
    status: "competitor-original",
    from: ["life-teen-juggle"],
  },
  "strip-06": {
    id: "strip-06",
    src: "/images/sleeve/strip/team-celebrate.webp",
    srcSet:
      "/images/sleeve/strip/team-celebrate-800.webp 800w, /images/sleeve/strip/team-celebrate.webp 1024w",
    width: 1024,
    height: 1024,
    alt: "Kids celebrating a goal",
    status: "competitor-original",
    from: ["life-team-celebrate"],
  },
  "strip-07": {
    id: "strip-07",
    src: "/images/sleeve/strip/thumbs-up.webp",
    srcSet:
      "/images/sleeve/strip/thumbs-up-800.webp 800w, /images/sleeve/strip/thumbs-up.webp 1024w",
    width: 1024,
    height: 1024,
    alt: "A boy giving a thumbs up, holding the sleeve",
    status: "competitor-original",
    from: ["life-thumbs-up"],
  },
  "strip-08": {
    id: "strip-08",
    src: "/images/sleeve/strip/basketball-gym.webp",
    srcSet:
      "/images/sleeve/strip/basketball-gym-800.webp 800w, /images/sleeve/strip/basketball-gym.webp 1200w",
    width: 1200,
    height: 655,
    alt: "A boy dribbling in a school gym game",
    status: "competitor-original",
    from: ["life-basketball-gym"],
  },
  "adv-team": {
    id: "adv-team",
    src: "/images/sleeve/advertorial/team.webp",
    srcSet:
      "/images/sleeve/advertorial/team-800.webp 800w, /images/sleeve/advertorial/team.webp 1024w",
    width: 1024,
    height: 1024,
    alt: "Kids celebrating a goal at a youth soccer match",
    status: "competitor-original",
    from: ["life-team-celebrate"],
  },
  "adv-practice": {
    id: "adv-practice",
    src: "/images/sleeve/advertorial/practice.webp",
    srcSet:
      "/images/sleeve/advertorial/practice-800.webp 800w, /images/sleeve/advertorial/practice.webp 1100w",
    width: 1100,
    height: 641,
    alt: "Two boys chasing the ball at practice",
    status: "competitor-original",
    from: ["life-soccer-match"],
  },
  "adv-dad": {
    id: "adv-dad",
    src: "/images/sleeve/advertorial/dad.webp",
    srcSet:
      "/images/sleeve/advertorial/dad-800.webp 800w, /images/sleeve/advertorial/dad.webp 1400w",
    width: 1400,
    height: 933,
    alt: "A dad and his son on a gym bench after a game",
    status: "competitor-original",
    from: ["life-dad-bench"],
  },
  "adv-court": {
    id: "adv-court",
    src: "/images/sleeve/advertorial/court.webp",
    srcSet:
      "/images/sleeve/advertorial/court-800.webp 800w, /images/sleeve/advertorial/court.webp 1400w",
    width: 1400,
    height: 1400,
    alt: "A girl dribbling on an outdoor court",
    status: "competitor-original",
    from: ["life-basketball-girl"],
  },
  "review-a": {
    id: "review-a",
    src: "/images/sleeve/reviews/a.webp",
    srcSet: "/images/sleeve/reviews/a.webp 800w",
    width: 800,
    height: 800,
    alt: "Customer photo from a competitor review",
    status: "competitor-original",
    from: ["review-a"],
  },
  "review-b": {
    id: "review-b",
    src: "/images/sleeve/reviews/b.webp",
    srcSet: "/images/sleeve/reviews/b.webp 800w",
    width: 800,
    height: 800,
    alt: "Customer photo from a competitor review",
    status: "competitor-original",
    from: ["review-b"],
  },
  "review-c": {
    id: "review-c",
    src: "/images/sleeve/reviews/c.webp",
    srcSet: "/images/sleeve/reviews/c.webp 800w",
    width: 800,
    height: 800,
    alt: "Customer photo from a competitor review",
    status: "competitor-original",
    from: ["review-c"],
  },
  "review-d": {
    id: "review-d",
    src: "/images/sleeve/reviews/d.webp",
    srcSet: "/images/sleeve/reviews/d.webp 800w",
    width: 800,
    height: 800,
    alt: "Customer photo from a competitor review",
    status: "competitor-original",
    from: ["review-d"],
  },
  "review-e": {
    id: "review-e",
    src: "/images/sleeve/reviews/e.webp",
    srcSet: "/images/sleeve/reviews/e.webp 800w",
    width: 800,
    height: 800,
    alt: "Customer photo from a competitor review",
    status: "competitor-original",
    from: ["review-e"],
  },
  "review-f": {
    id: "review-f",
    src: "/images/sleeve/reviews/f.webp",
    srcSet: "/images/sleeve/reviews/f.webp 800w",
    width: 800,
    height: 800,
    alt: "Customer photo from a competitor review",
    status: "competitor-original",
    from: ["review-f"],
  },
  "review-g": {
    id: "review-g",
    src: "/images/sleeve/reviews/g.webp",
    srcSet: "/images/sleeve/reviews/g.webp 800w",
    width: 800,
    height: 800,
    alt: "Customer photo from a competitor review",
    status: "competitor-original",
    from: ["review-g"],
  },
  "review-h": {
    id: "review-h",
    src: "/images/sleeve/reviews/h.webp",
    srcSet: "/images/sleeve/reviews/h.webp 800w",
    width: 800,
    height: 800,
    alt: "Customer photo from a competitor review",
    status: "competitor-original",
    from: ["review-h"],
  },
} as const satisfies Record<string, SiteImage>;

export type ImageId = keyof typeof images;

/** The auto-scrolling lifestyle strip (SOP section 4). */
export const stripImages: SiteImage[] = Object.values(images).filter((image) =>
  image.id.startsWith("strip-"),
);
