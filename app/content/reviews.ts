// PLACEHOLDER REVIEWS. We have no customers yet. Two kinds, both labelled on
// the page and all of them to be replaced with our own verified reviews
// before launch:
//
// - "adapted": public Judge.me reviews of the competitor's sleeve. Almost
//   every original makes a health claim (pain gone, Sever's relieved, no more
//   limping): those parts are removed, keeping only fit, comfort, wear,
//   sizing and service. The originals aren't carried into this repo. Photos
//   are the competitor's customer photos and are labelled the same way.
// - "illustrative": written for the concept so the layouts, filters and
//   themes can be judged with every kind of review a real store gets,
//   including critical ones with a reply. They never mention an outcome.
//
// Item reviews (kit, knee sleeve and so on) are all illustrative.

import type { ProductId } from "./catalog";
import type { Review } from "./types";

export const ADAPTED_SOURCE =
  "Adapted from a competitor review (Judge.me, asoleo.com)";
export const ILLUSTRATIVE_SOURCE =
  "Illustrative review written for this concept";
const sourceUrl =
  "https://asoleo.com/products/compression-ankle-sheath#judgeme_product_reviews";

type Draft = Omit<
  Review,
  "kind" | "source" | "sourceUrl" | "featured" | "rating" | "photo"
> & { rating: number; photo?: string };

const adapted: Draft[] = [
  {
    id: "haley",
    name: "Haley",
    rating: 5,
    title: "He asks for them by name",
    body: "My son loves these. He wears them on long game days and asks for them by name.",
    photo: "review-c",
    date: "2026-10-18",
    variant: { bundle: "pair", colour: "black", size: "M" },
    tags: ["comfort"],
    helpful: 34,
  },
  {
    id: "katlin",
    name: "Katlin",
    rating: 5,
    title: "They live in his kit bag",
    body: "Our 10-year-old plays sports all year. These live in his kit bag now and go on before every practice.",
    photo: "review-b",
    date: "2026-09-28",
    variant: { bundle: "two-pairs", colour: "blue", size: "M" },
    tags: ["comfort", "easy"],
    helpful: 29,
  },
  {
    id: "crystal",
    name: "Crystal",
    rating: 5,
    title: "Ordering a second pair",
    body: "We're ordering another pair so he has one for practice and one for games.",
    photo: "review-a",
    date: "2026-09-14",
    variant: { bundle: "pair", colour: "green", size: "L" },
    tags: ["wear"],
    helpful: 22,
  },
  {
    id: "karl",
    name: "Karl",
    rating: 5,
    title: "Fits perfectly",
    body: "Fits perfectly and stays in place through a full training session.",
    photo: "review-e",
    date: "2026-07-23",
    variant: { bundle: "pair", colour: "black", size: "L" },
    tags: ["fit", "stays"],
    helpful: 18,
  },
  {
    id: "jessica",
    name: "Jessica H.",
    rating: 5,
    title: "Comfortable enough for every practice",
    body: "I was skeptical before buying, but she's worn it to every practice for two weeks and says it's comfortable.",
    photo: "review-d",
    date: "2026-08-16",
    variant: { bundle: "pair", colour: "red", size: "S" },
    tags: ["comfort"],
    helpful: 21,
  },
  {
    id: "roxanne",
    name: "Roxanne",
    rating: 5,
    title: "Bought for my grandson",
    body: "Bought these for my grandson, who plays football and baseball. He wears them for both.",
    photo: "review-h",
    date: "2026-08-28",
    variant: { bundle: "pair", colour: "blue", size: "L" },
    tags: ["comfort"],
    helpful: 12,
  },
  {
    id: "c-parent",
    name: "C.",
    rating: 5,
    title: "Flexible, and he puts them on himself",
    body: "They're flexible, so his ankle still moves normally, and he puts them on himself before practice.",
    photo: "review-f",
    date: "2026-08-04",
    variant: { bundle: "pair", colour: "black", size: "M" },
    tags: ["easy", "comfort"],
    helpful: 26,
  },
  {
    id: "sports-mom",
    name: "Anonymous",
    rating: 5,
    title: "Stays put under football socks",
    body: "As a mom of an athlete I've recommended these to other sports moms. They're easy to put on and stay put under his football socks.",
    photo: "review-g",
    date: "2026-10-07",
    variant: { bundle: "pair", colour: "green", size: "M" },
    tags: ["stays", "easy"],
    helpful: 19,
  },
  {
    id: "exchange",
    name: "Anonymous",
    rating: 5,
    title: "Wrong size, sorted quickly",
    body: "I ordered the wrong size and customer service sorted out a replacement quickly. Would order again.",
    date: "2026-07-16",
    variant: { bundle: "one", colour: "black", size: "S" },
    tags: ["service", "fit"],
    helpful: 24,
  },
  {
    id: "shannon",
    name: "Shannon",
    rating: 5,
    title: "Fantastic customer service",
    body: "Fantastic customer service. My son wears his every game. Highly recommend this company.",
    date: "2026-10-19",
    variant: { bundle: "pair", colour: "red", size: "M" },
    tags: ["service"],
    helpful: 16,
  },
  {
    id: "deborah",
    name: "Deborah H.",
    rating: 5,
    title: "Wears it every time he plays",
    body: "He loves it so far and wears it every time he plays ball.",
    date: "2026-08-03",
    variant: { bundle: "pair", colour: "blue", size: "L" },
    tags: ["comfort"],
    helpful: 9,
  },
  {
    id: "katerina",
    name: "Katerina",
    rating: 5,
    title: "No reminders needed",
    body: "He wears it to every training session without being reminded.",
    date: "2026-07-22",
    variant: { bundle: "pair", colour: "black", size: "M" },
    tags: ["comfort"],
    helpful: 8,
  },
  {
    id: "leeanne",
    name: "Leeanne",
    rating: 5,
    title: "Quick delivery, great quality",
    body: "The order came quickly, the quality is great, and they're comfortable for my boys to wear.",
    date: "2026-05-24",
    variant: { bundle: "two-pairs", colour: "black", size: "L" },
    tags: ["service", "comfort", "wear"],
    helpful: 15,
  },
  {
    id: "brad",
    name: "Brad J.",
    rating: 5,
    title: "Actually stays in place",
    body: "Other sleeves we tried slid down during games, but these stay put. My kid plays without thinking about it.",
    date: "2025-10-21",
    variant: { bundle: "pair", colour: "black", size: "L" },
    tags: ["stays"],
    helpful: 31,
  },
  {
    id: "tom",
    name: "Tom M.",
    rating: 5,
    title: "Easy on, fits in his cleats",
    body: "Does what it says. It's easy to put on, and it fits in his cleats fine.",
    date: "2025-11-08",
    variant: { bundle: "pair", colour: "green", size: "M" },
    tags: ["easy", "cleats"],
    helpful: 27,
  },
  {
    id: "chrism",
    name: "Chris M.",
    rating: 5,
    title: "She puts it on herself",
    body: "Simple to put on, and my daughter can do it herself. It fits in her cleats fine.",
    date: "2025-10-20",
    variant: { bundle: "pair", colour: "red", size: "S" },
    tags: ["easy", "cleats"],
    helpful: 23,
  },
  {
    id: "markt",
    name: "Mark T.",
    rating: 5,
    title: "Well made and comfortable",
    body: "Well made and comfortable. My son wears them for every practice now.",
    date: "2025-10-31",
    variant: { bundle: "pair", colour: "black", size: "XL" },
    tags: ["wear", "comfort"],
    helpful: 11,
  },
  {
    id: "greg",
    name: "Greg A.",
    rating: 5,
    title: "Snug without being too tight",
    body: "Fits great and feels snug without being too tight. It stays in place through lacrosse.",
    date: "2025-11-09",
    variant: { bundle: "pair", colour: "blue", size: "L" },
    tags: ["fit", "stays"],
    helpful: 14,
  },
  {
    id: "amandak",
    name: "Amanda K.",
    rating: 4,
    title: "Runs a little small",
    body: "She likes wearing them for dance. They run a little small, so size up if your child is between sizes.",
    date: "2025-10-15",
    variant: { bundle: "pair", colour: "black", size: "S" },
    tags: ["fit"],
    helpful: 38,
    reply:
      "Thanks, Amanda, that's really useful. Our size guide says the same: between sizes, go up one. If the size is wrong, we'll swap it.",
  },
  {
    id: "rachelg",
    name: "Rachel G.",
    rating: 4,
    title: "Thinner than the braces we tried",
    body: "We tried big, clunky braces, but my son hated them and they didn't fit in his cleats. These are thin and still feel supportive.",
    date: "2025-10-09",
    variant: { bundle: "pair", colour: "black", size: "M" },
    tags: ["cleats", "comfort"],
    helpful: 25,
  },
  {
    id: "michelles",
    name: "Michelle S.",
    rating: 5,
    title: "He actually wants to wear them",
    body: "My son actually wants to wear them, which is saying something.",
    date: "2025-11-20",
    variant: { bundle: "pair", colour: "green", size: "M" },
    tags: ["comfort"],
    helpful: 13,
  },
  {
    id: "meisha",
    name: "Meisha",
    rating: 5,
    title: "Great service with a sizing mix-up",
    body: "My son liked how it felt, but I need a different size for a better fit. I had an issue with my first order, and customer service sorted it out straight away.",
    date: "2026-06-28",
    variant: { bundle: "one", colour: "blue", size: "M" },
    tags: ["service", "fit"],
    helpful: 17,
  },
  {
    id: "boots",
    name: "Anonymous",
    rating: 5,
    title: "Can fold over in football boots",
    body: "He's happy to wear them. The only catch: it can fold over inside his football boots, so we pull it smooth before lacing up.",
    date: "2026-06-13",
    variant: { bundle: "pair", colour: "black", size: "L" },
    tags: ["cleats", "easy"],
    helpful: 20,
    reply:
      "Good tip, thank you. Pull the sleeve smooth, put the sock on over it, then the boot: that keeps it flat.",
  },
  {
    id: "velcro",
    name: "Anonymous",
    rating: 5,
    title: "Keep the strap closed",
    body: "So far it's been great. The only downside is the hook-and-loop can catch on the knit if it's left open, so we keep the strap closed.",
    date: "2026-06-09",
    variant: { bundle: "pair", colour: "red", size: "M" },
    tags: ["wear"],
    helpful: 22,
    reply:
      "Thank you. Closing the strap before taking it off, and washing it in the mesh bag, stops it snagging. If the knit pulls in normal use, our quality promise covers a replacement.",
  },
  {
    id: "fray",
    name: "Anonymous",
    rating: 4,
    title: "Strap edge started to fray",
    body: "My child likes wearing it. I took off one star because the hook-and-loop strap is already starting to fray.",
    date: "2026-06-07",
    variant: { bundle: "one", colour: "black", size: "M" },
    tags: ["wear"],
    helpful: 19,
    reply:
      "Sorry about that: it shouldn't happen this soon. Message us with a photo and we'll replace it under our quality promise.",
  },
  {
    id: "dana",
    name: "Dana",
    rating: 5,
    title: "He learned to put them on himself",
    body: "He learned to put them on himself because he wanted to do it on his own. He wears them for every football game.",
    date: "2026-06-07",
    variant: { bundle: "pair", colour: "green", size: "M" },
    tags: ["easy"],
    helpful: 12,
  },
  {
    id: "teen",
    name: "Anonymous",
    rating: 5,
    title: "He likes how it feels",
    body: "My son, 13, is happily wearing the sleeve. He likes how his foot feels in it.",
    date: "2026-05-21",
    variant: { bundle: "pair", colour: "black", size: "L" },
    tags: ["comfort"],
    helpful: 7,
  },
  {
    id: "runrfsh",
    name: "Runrfsh",
    rating: 4,
    title: "Waiting for the season to start",
    body: "It fits well and he likes it, but it's the off-season, so we'll know more when soccer starts again.",
    date: "2026-06-25",
    variant: { bundle: "one", colour: "blue", size: "M" },
    tags: ["fit"],
    helpful: 10,
  },
  {
    id: "lubahn",
    name: "Lubahn",
    rating: 5,
    title: "Should have bought two",
    body: "I should have bought two from the start, one for each foot.",
    date: "2026-06-24",
    variant: { bundle: "one", colour: "red", size: "S" },
    tags: ["fit"],
    helpful: 9,
  },
  {
    id: "rachel",
    name: "Rachel",
    rating: 5,
    title: "Felt good straight away",
    body: "He said they felt good the moment he put them on.",
    date: "2026-05-19",
    variant: { bundle: "pair", colour: "black", size: "M" },
    tags: ["comfort"],
    helpful: 8,
  },
  {
    id: "loves",
    name: "Anonymous",
    rating: 5,
    title: "He loves them",
    body: "My son loves them and says his feet feel great in them.",
    date: "2026-05-07",
    variant: { bundle: "pair", colour: "blue", size: "S" },
    tags: ["comfort"],
    helpful: 5,
  },
  {
    id: "fast",
    name: "Anonymous",
    rating: 5,
    title: "Fast delivery",
    body: "Great product, fast delivery.",
    date: "2026-09-17",
    variant: { bundle: "two-pairs", colour: "black", size: "M" },
    tags: ["service"],
    helpful: 6,
  },
  {
    id: "hocker",
    name: "Hocker",
    rating: 5,
    title: "For baseball season",
    body: "Our grandson wears it for baseball. Love the sleeve.",
    date: "2026-05-16",
    variant: { bundle: "pair", colour: "red", size: "L" },
    tags: ["comfort"],
    helpful: 4,
  },
  {
    id: "lookalike",
    name: "Jennifer M.",
    rating: 5,
    title: "Better than the cheap lookalike",
    body: "We tried a cheap lookalike first and it fell apart in two weeks. My daughter has worn this one for three months now.",
    date: "2025-12-27",
    variant: { bundle: "pair", colour: "black", size: "M" },
    tags: ["wear"],
    helpful: 28,
  },
  {
    id: "martial",
    name: "Rltadlock",
    rating: 5,
    title: "Wears it for martial arts",
    body: "My son wears it for martial arts as well as his other sports.",
    date: "2026-10-13",
    variant: { bundle: "one", colour: "black", size: "M" },
    tags: ["comfort"],
    helpful: 3,
  },
  {
    id: "michaelr",
    name: "Michael R.",
    rating: 4,
    title: "Does what it says",
    body: "Does what it says: snug and supportive.",
    date: "2025-11-13",
    variant: { bundle: "pair", colour: "black", size: "XL" },
    tags: ["fit"],
    helpful: 6,
  },
  {
    id: "chrisp",
    name: "Chris P.",
    rating: 4,
    title: "Feels supportive",
    body: "A good, snug fit, and my son says it feels supportive.",
    date: "2025-10-27",
    variant: { bundle: "pair", colour: "blue", size: "M" },
    tags: ["fit", "comfort"],
    helpful: 7,
  },
];

const illustrative: Draft[] = [
  {
    id: "measured",
    name: "Lauren P.",
    rating: 5,
    title: "Measured, ordered, fit first time",
    body: "We measured his ankle like the guide says, landed on M, and it fit first time. The card in the box made the strap easy to set.",
    date: "2026-10-22",
    variant: { bundle: "pair", colour: "blue", size: "M" },
    tags: ["fit", "easy"],
    helpful: 33,
  },
  {
    id: "twins",
    name: "Nadia R.",
    rating: 5,
    title: "Two kids, two sizes, one order",
    body: "Two pairs: an S for my 8-year-old and an L for her brother, in different colours so nobody grabs the wrong one.",
    date: "2026-10-15",
    variant: { bundle: "two-pairs", colour: "red", size: "S" },
    tags: ["fit", "easy"],
    helpful: 21,
  },
  {
    id: "washes",
    name: "Owen T.",
    rating: 5,
    title: "Still looks new after a lot of washes",
    body: "Strap closed, mesh bag, cold wash, air dry. A whole fall season of washes and it still looks new.",
    date: "2026-10-09",
    variant: { bundle: "pair", colour: "black", size: "L" },
    tags: ["wear"],
    helpful: 18,
  },
  {
    id: "shinguards",
    name: "Grace L.",
    rating: 5,
    title: "No bunching under shin guards",
    body: "It sits flat under her shin guards and socks, and her cleats lace up as normal.",
    date: "2026-10-01",
    variant: { bundle: "pair", colour: "green", size: "S" },
    tags: ["cleats", "stays"],
    helpful: 24,
  },
  {
    id: "strap",
    name: "Priya M.",
    rating: 3,
    title: "Strap is long on the smallest size",
    body: "The strap on the S is a little long for my daughter's narrow ankles, so the end overlaps more than I'd like. She still wears it.",
    date: "2026-09-24",
    variant: { bundle: "one", colour: "red", size: "S" },
    tags: ["fit"],
    helpful: 15,
    reply:
      "Thanks, Priya. Folding the end back on itself before pressing it closed keeps it neat. We've asked the supplier about a shorter strap for size S.",
  },
  {
    id: "swap",
    name: "Ethan B.",
    rating: 5,
    title: "Size swap took one email",
    body: "I ordered M and needed L. One email, and the new size arrived the following week.",
    date: "2026-09-12",
    variant: { bundle: "pair", colour: "black", size: "L" },
    tags: ["service", "fit"],
    helpful: 20,
  },
  {
    id: "hoops",
    name: "Marcus D.",
    rating: 5,
    title: "Doesn't slide down on the court",
    body: "He plays three basketball games a weekend and it stays exactly where he put it.",
    date: "2026-08-30",
    variant: { bundle: "pair", colour: "black", size: "XL" },
    tags: ["stays"],
    helpful: 14,
  },
  {
    id: "grandma",
    name: "Pat W.",
    rating: 5,
    title: "Birthday present in team colours",
    body: "I bought a pair in his team colour for my grandson's birthday. He wore them to his very next game.",
    date: "2026-08-21",
    variant: { bundle: "pair", colour: "green", size: "M" },
    tags: ["comfort"],
    helpful: 11,
  },
  {
    id: "practice",
    name: "Sam K.",
    rating: 4,
    title: "Takes one practice run",
    body: "The figure-8 strap confused us the first time. After one go with the card from the box, he does it in under a minute.",
    date: "2026-08-12",
    variant: { bundle: "pair", colour: "blue", size: "M" },
    tags: ["easy"],
    helpful: 17,
  },
  {
    id: "colours",
    name: "Tasha G.",
    rating: 5,
    title: "Each kid picked a colour",
    body: "My boys each picked a trim colour, so there's no arguing over whose is whose in the laundry.",
    date: "2026-07-28",
    variant: { bundle: "two-pairs", colour: "green", size: "M" },
    tags: ["wear", "easy"],
    helpful: 10,
  },
  {
    id: "tournament",
    name: "Jenna F.",
    rating: 5,
    title: "Comfortable through a long tournament",
    body: "Two days, five games, and she never asked to take it off between them.",
    date: "2026-07-15",
    variant: { bundle: "pair", colour: "red", size: "M" },
    tags: ["comfort", "stays"],
    helpful: 12,
  },
  {
    id: "coach",
    name: "Ryan H.",
    rating: 5,
    title: "The coach asked where we got them",
    body: "After a few games, our coach asked where we got them. Three kids on the team wear them now.",
    date: "2026-06-30",
    variant: { bundle: "pair", colour: "black", size: "L" },
    tags: ["comfort"],
    helpful: 9,
  },
  {
    id: "late",
    name: "Mark S.",
    rating: 2,
    title: "Arrived later than expected",
    body: "It took nine days to arrive, and I wanted it for the weekend tournament. The sleeve itself is fine.",
    date: "2026-06-18",
    variant: { bundle: "one", colour: "black", size: "M" },
    tags: ["service"],
    helpful: 13,
    reply:
      "Sorry, Mark. That's too slow. We're planning 1–2 business day dispatch with tracking, and you can always reply to your order email and we'll chase a parcel.",
  },
];

/** Reviews of the other catalogue items (all illustrative). */
const items: (Draft & { product: ProductId })[] = [
  {
    id: "kit-1",
    product: "game-day-kit",
    name: "Melissa O.",
    rating: 5,
    title: "Everything for the season in one box",
    body: "Two sleeves, the wash bag and the sizing card. It's exactly what we needed for the start of the season.",
    date: "2026-10-04",
    tags: ["easy"],
    helpful: 8,
  },
  {
    id: "kit-2",
    product: "game-day-kit",
    name: "Andre W.",
    rating: 5,
    title: "Good value as a set",
    body: "It costs less than buying the pieces separately, and it all came together.",
    date: "2026-09-02",
    tags: ["service"],
    helpful: 4,
  },
  {
    id: "kit-3",
    product: "game-day-kit",
    name: "Holly N.",
    rating: 4,
    title: "Great kit, pick sizes carefully",
    body: "Lovely set. Both sleeves come in one size, so measure carefully if your child is between sizes.",
    date: "2026-07-19",
    tags: ["fit"],
    helpful: 6,
  },
  {
    id: "knee-1",
    product: "knee-sleeve",
    name: "Jordan C.",
    rating: 5,
    title: "Matches the heel sleeves",
    body: "She wears it for volleyball, and it matches her heel sleeves.",
    date: "2026-09-20",
    tags: ["comfort"],
    helpful: 5,
  },
  {
    id: "knee-2",
    product: "knee-sleeve",
    name: "Ben A.",
    rating: 4,
    title: "Comfortable, check the size chart",
    body: "Comfortable and stays up. Measure above the knee before ordering, it runs true to the chart.",
    date: "2026-08-08",
    tags: ["fit"],
    helpful: 3,
  },
  {
    id: "bag-1",
    product: "wash-bag",
    name: "Kim S.",
    rating: 5,
    title: "No more snagged straps",
    body: "All four sleeves go in one bag, and the straps don't catch on everything else in the wash.",
    date: "2026-09-27",
    tags: ["wear"],
    helpful: 7,
  },
  {
    id: "bag-2",
    product: "wash-bag",
    name: "Leo F.",
    rating: 5,
    title: "Simple and it works",
    body: "Zip, wash, done. Worth adding to the order.",
    date: "2026-08-15",
    tags: ["wear"],
    helpful: 2,
  },
  {
    id: "bag-3",
    product: "wash-bag",
    name: "Erin D.",
    rating: 5,
    title: "Keeps pairs together",
    body: "The sleeves stay together as a pair instead of vanishing in the laundry.",
    date: "2026-07-03",
    tags: ["wear"],
    helpful: 3,
  },
  {
    id: "gift-1",
    product: "gift-card",
    name: "Carla V.",
    rating: 5,
    title: "Let them choose the size",
    body: "Not sure of my nephew's size, so a gift card let his parents measure and pick.",
    date: "2026-10-10",
    tags: ["service"],
    helpful: 4,
  },
  {
    id: "gift-2",
    product: "gift-card",
    name: "Tom R.",
    rating: 5,
    title: "Easy team gift",
    body: "Sent gift cards to the team parents at the end of the season. Easy.",
    date: "2026-08-26",
    tags: ["service"],
    helpful: 2,
  },
];

function finish(draft: Draft, kind: Review["kind"]): Review {
  return {
    ...draft,
    rating: draft.rating as Review["rating"],
    photo: draft.photo as Review["photo"],
    kind,
    source: kind === "adapted" ? ADAPTED_SOURCE : ILLUSTRATIVE_SOURCE,
    sourceUrl: kind === "adapted" ? sourceUrl : undefined,
    // Critical reviews stay on the wall (with a reply) but are never chosen
    // for a highlight slot.
    featured: draft.rating >= 4,
  };
}

export const reviews: Review[] = [
  ...adapted.map((r) => finish(r, "adapted")),
  ...illustrative.map((r) => finish(r, "illustrative")),
  ...items.map((r) => finish(r, "illustrative")),
];

export function getReview(id: string) {
  const review = reviews.find((r) => r.id === id);
  if (!review) throw new Error(`Unknown review ${id}`);
  return review;
}

/** Every review of a product, newest first. */
export function reviewsFor(product: ProductId) {
  return reviews
    .filter((r) => (r.product ?? "sleeve") === product)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export type ReviewSort =
  "relevant" | "recent" | "highest" | "lowest" | "photos";

export const REVIEW_SORTS: { id: ReviewSort; label: string }[] = [
  { id: "relevant", label: "Most relevant" },
  { id: "recent", label: "Most recent" },
  { id: "photos", label: "With photos first" },
  { id: "highest", label: "Highest rated" },
  { id: "lowest", label: "Lowest rated" },
];

/** "Most relevant" puts photo reviews first, then the most helpful. */
export function sortReviews(list: Review[], sort: ReviewSort) {
  const byDate = (a: Review, b: Review) => b.date.localeCompare(a.date);
  const sorted = [...list];
  if (sort === "recent") return sorted.sort(byDate);
  if (sort === "highest")
    return sorted.sort((a, b) => b.rating - a.rating || byDate(a, b));
  if (sort === "lowest")
    return sorted.sort((a, b) => a.rating - b.rating || byDate(a, b));
  if (sort === "photos")
    return sorted.sort(
      (a, b) => Number(!!b.photo) - Number(!!a.photo) || byDate(a, b),
    );
  return sorted.sort(
    (a, b) =>
      Number(b.featured) - Number(a.featured) ||
      Number(!!b.photo) - Number(!!a.photo) ||
      b.helpful - a.helpful,
  );
}

export const productReviews = reviewsFor("sleeve");
export const photoReviews = sortReviews(
  productReviews.filter((r) => r.photo),
  "relevant",
);
const relevant = sortReviews(productReviews, "relevant");

/** Homepage and hub highlights: photo reviews first. */
export const wallReviews = relevant.slice(0, 8);

/** Section 7 "final stories": six with titles the first page of the wall leaves out. */
export const closingReviews = relevant
  .slice(12)
  .filter((r) => r.featured && r.body.length > 90)
  .slice(0, 6);

/** "Mar 3, 2026". UTC so prerendered HTML matches the browser. */
export function formatReviewDate(iso: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}
