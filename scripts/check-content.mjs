#!/usr/bin/env node
// Checks the server-rendered pages of a running storefront against the SOP
// and the content rules in AGENTS.md: section order, gallery slides, bundles,
// proof blocks, placeholder labels, the advertorial's labelling, and an
// honesty lint over visible text.
//
//   npm run dev                 # or any running server
//   npm run check:content       # BASE=http://localhost:3102 by default

const BASE = (process.env.BASE ?? "http://localhost:3102").replace(/\/$/, "");
const HERO = "/products/rally-heel-sleeve";

const SOP_SECTIONS = [
  "above-the-fold",
  "buy-box",
  "under-the-button",
  "details",
  "social-proof",
  "value-props",
  "closing",
];
const SLIDE_LABELS = [
  "Benefit headline",
  "In use",
  "Before and after",
  "What's included",
  "How it works",
  "Us vs alternatives",
  "Review",
  "Silent demo video",
];
const REQUIRED_BLOCKS = ["description", "qna", "guarantee-steps", "final-cta"];
const STORE_PAGES = [
  "/",
  "/about",
  "/how-it-works",
  "/faq",
  "/contact",
  "/policies/shipping",
  "/policies/returns",
  "/policies/privacy",
  "/policies/terms",
  "/journal",
  "/cart",
  "/collections",
];

// Fake urgency, unverifiable sales counts and invented endorsements. A sentence
// that negates one ("No countdowns, ever") is allowed.
const BANNED = [
  /\bcountdown/i,
  /\bonly \d+ left\b/i,
  /\bselling out\b/i,
  /\bsell[- ]?out risk\b/i,
  /\blimited stock\b/i,
  /\b\d[\d,.]*\s*(?:k\s*)?(?:sold|sleeves sold|pairs sold|units sold)\b/i,
  /\bsold worldwide\b/i,
  /\b(?:doctor|expert|influencer)[- ]recommended\b/i,
  /\bendorsed by\b/i,
];
const NEGATION = /\b(?:no|not|never|without|won't|don't|isn't)\b/i;
// Wording that only made sense in the retro-camera mock store.
const MOCK_LEFTOVERS = [
  /\bdemo store\b/i,
  /\bconcept store\b/i,
  /\btester panel\b/i,
  /\bnot a real store\b/i,
];

const problems = [];
const fail = (path, message) => problems.push(`${path}  ${message}`);

async function get(path) {
  const response = await fetch(BASE + path, { redirect: "manual" });
  const html = await response.text();
  if (response.status !== 200) fail(path, `status ${response.status}`);
  return html;
}

function decode(text) {
  return text
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;|&#160;/g, " ");
}

function visibleText(html) {
  return decode(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  )
    .replace(/\s+/g, " ")
    .trim();
}

const count = (html, pattern) => (html.match(pattern) ?? []).length;

function lintText(path, html) {
  const sentences = visibleText(html).split(/(?<=[.!?])\s+/);
  for (const sentence of sentences) {
    for (const pattern of BANNED) {
      if (pattern.test(sentence) && !NEGATION.test(sentence)) {
        fail(path, `honesty lint: "${sentence.slice(0, 120)}"`);
      }
    }
    for (const pattern of MOCK_LEFTOVERS) {
      if (pattern.test(sentence))
        fail(path, `mock-store wording: "${sentence.slice(0, 120)}"`);
    }
  }
}

function checkProductPage(path, html) {
  const sections = [...html.matchAll(/data-sop-section="([a-z-]+)"/g)].map(
    (m) => m[1],
  );
  if (sections.join(",") !== SOP_SECTIONS.join(",")) {
    fail(
      path,
      `SOP sections are [${sections.join(", ")}], expected [${SOP_SECTIONS.join(", ")}]`,
    );
  }

  // shadcn's CarouselItem writes data-slot and class between these attributes.
  const slides = [
    ...html.matchAll(
      /aria-roledescription="slide"[^>]*?aria-label="\d+ of \d+: ([^"]+)"/g,
    ),
  ].map((m) => decode(m[1]));
  if (slides.join("|") !== SLIDE_LABELS.join("|")) {
    fail(
      path,
      `gallery slides are [${slides.join(", ")}], expected [${SLIDE_LABELS.join(", ")}]`,
    );
  }

  const bundles = count(html, /<input[^>]*name="bundle-[^"]*"/g);
  if (bundles !== 3) fail(path, `${bundles} bundle inputs, expected exactly 3`);

  const cards = count(html, /data-review-card/g);
  if (cards < 12) fail(path, `${cards} review cards, expected at least 12`);
  const reviewTags = count(html, /data-placeholder="review-placeholder"/g);
  if (reviewTags < cards)
    fail(
      path,
      `${cards} review cards but only ${reviewTags} placeholder-review tags`,
    );

  for (const block of REQUIRED_BLOCKS) {
    if (!html.includes(`data-block="${block}"`))
      fail(path, `missing block "${block}"`);
  }
  if (!html.includes('data-proof="rating"')) fail(path, "missing the rating");
  const illustrative = count(html, /data-placeholder="illustrative"/g);
  if (illustrative < 2)
    fail(path, `${illustrative} illustrative labels, expected at least 2`);
}

async function main() {
  checkProductPage(HERO, await get(HERO));
  lintText(HERO, await get(HERO));
  // The Black Friday offer, previewed in development (ignored by production servers).
  const bf = `${HERO}?offer=black-friday`;
  const bfHtml = await get(bf);
  checkProductPage(bf, bfHtml);
  lintText(bf, bfHtml);

  for (const path of STORE_PAGES) {
    const html = await get(path);
    lintText(path, html);
    if (path === "/") {
      if (
        !html.includes('data-proof="rating"') &&
        !html.includes("data-rating")
      ) {
        fail(path, "missing the rating");
      }
      const cards = count(html, /data-review-card/g);
      if (cards < 6) fail(path, `${cards} review cards, expected at least 6`);
    }
  }

  // Journal: the advertorial and the guide.
  const journal = await get("/journal");
  const articles = [
    ...new Set(
      [...journal.matchAll(/href="(\/journal\/[a-z0-9-]+)"/g)].map((m) => m[1]),
    ),
  ];
  if (articles.length < 2)
    fail("/journal", `${articles.length} articles linked, expected 2`);
  let advertorials = 0;
  for (const path of articles) {
    const html = await get(path);
    lintText(path, html);
    if (visibleText(html).includes("Brand content")) {
      advertorials++;
      if (!html.includes(`href="${HERO}`))
        fail(path, `the advertorial doesn't link to ${HERO}`);
    }
  }
  if (advertorials !== 1)
    fail(
      "/journal",
      `${advertorials} articles marked "Brand content", expected 1`,
    );

  if (problems.length > 0) {
    console.error(
      `check:content found ${problems.length} problem(s) at ${BASE}:\n`,
    );
    for (const problem of problems) console.error(`  ${problem}`);
    process.exit(1);
  }
  console.log(
    `check:content: ${STORE_PAGES.length + articles.length + 2} pages pass at ${BASE}`,
  );
}

main().catch((error) => {
  console.error(`check:content could not reach ${BASE}: ${error.message}`);
  process.exit(1);
});
