import type { BrandConcept } from "./types";

export const brand: BrandConcept = {
  id: "rally",
  letter: "A",
  direction: "Game day: sporty performance",
  name: "Rally",
  productName: "Rally Heel Sleeve",
  tagline: "Kit up. Strap in. Play on.",
  story:
    "Rally makes gear for the kids who live in their cleats: club soccer on Saturday, basketball on Tuesday, track in the spring. The heel sleeve goes in the kit bag next to the shin guards. It's slim, it straps round the heel, and kids actually want to wear it.",
  audience:
    "Parents of 9–14-year-olds in club and travel sports (soccer, basketball, track) who buy gear the way they buy cleats: quickly, on a phone, between practices.",
  positioning:
    "Game-day kit for growing athletes: a heel sleeve that belongs with the shin guards, not in the medicine cabinet.",
  personality: ["Energetic", "Direct", "Team-first", "Unfussy"],
  hypothesis:
    "Framing the sleeve as game-day kit rather than medical gear lowers the barrier for kids (it looks like sports equipment) and for parents (it reads as something to buy, not a diagnosis). Short, punchy, kit-led pages should convert cold Meta and TikTok traffic.",
  traffic:
    "Meta and TikTok cold audiences: sports parents, club soccer and youth basketball interests",
  photography:
    "Fast, low-angle action shots under gym lights and on grass, kit bags and cleats, scoreboard-style overlays. The sleeve is always visible on the ankle.",
  packaging:
    "A navy-black tube like a shin-guard sleeve, lime pull tab, the size printed huge on the end so it can be grabbed from a kit bag.",
  promotion:
    "Scoreboard promos in Barlow Condensed ('BF / PAIRS FROM $X') on navy with a lime stripe. Savings in dollars, never countdowns.",
  logoNote:
    "Italic Barlow Condensed wordmark with a lime field-line stripe under the R. The stripe works alone as a tab, favicon and sock print.",
  palette: [
    { name: "Chalk", hex: "#F2F4EF", role: "Background" },
    { name: "Night", hex: "#0B1320", role: "Text, dark sections" },
    { name: "Lime", hex: "#C6F432", role: "Buttons, highlights" },
    { name: "Signal", hex: "#FF5A1F", role: "Badges, markers" },
    { name: "Turf grey", hex: "#4E5A6B", role: "Secondary text" },
    { name: "White", hex: "#FFFFFF", role: "Surfaces" },
  ],
  fonts: {
    heading: { family: "Barlow Condensed", weights: "600, 800, italic 800" },
    body: { family: "Barlow", weights: "400, 500, 600" },
    href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:ital,wght@0,600;0,800;1,800&family=Barlow:wght@400;500;600&display=swap",
  },
  layout: {
    header: "left",
    hero: "headline-first",
    bundlePicker: "spec-sheet",
    reviews: "log-rows",
    valueProps: "numbered",
    divider: "perforation",
  },
  compare: {
    heroImage: "life-basketball",
    headline: "Heel sleeve. Kit-bag ready.",
    cta: "Kit up",
  },
  bundleNames: {
    one: { title: "×1", subtitle: "One sleeve" },
    pair: { title: "×2", subtitle: "A pair: both feet" },
    "two-pairs": { title: "×4", subtitle: "Game and practice" },
  },
  offers: {
    standard: {
      banner: "Free parent guide with every pair / Free wash bag with ×4",
      eyebrow: "Rally / Heel sleeve",
      cta: "Add to kit",
      badge: "Save",
    },
    "black-friday": {
      banner: "Black Friday / Free parent guide and wash bag with every pair",
      eyebrow: "Rally / Black Friday",
      headline: "Black Friday kit drop",
      cta: "Get the BF price",
      badge: "BF",
    },
  },
  pdp: {
    eyebrow: "Rally / Heel sleeve",
    titleBenefit: "a heel sleeve slim enough for cleats",
    subheadline:
      "A knitted compression sleeve with a strap that wraps round the heel. It slides under socks, laces into cleats and goes in the kit bag with the shin guards.",
    bullets: [
      { icon: "cleat", text: "Slim knit made to fit inside cleats" },
      { icon: "strap", text: "Figure-8 strap wraps round the heel" },
      { icon: "ruler", text: "4 sizes, youth 3 to adult 11" },
      { icon: "wash", text: "Wash cold, air dry, back in the bag" },
    ],
    stepHeading: "Step 1 / Pick your pack",
    fitStep: "Step 2 / Size and colour for each sleeve",
    underButtonReview: "karl",
    gallery: {
      benefit: {
        eyebrow: "Rally Heel Sleeve",
        headline: "Kit up. Strap in. Play on.",
        sub: "Slim enough for cleats",
      },
      inUse: {
        headline: "On before warm-up",
        sub: "Strap snug, laces tight",
      },
      comparison: {
        headline: "Same bench. One change.",
        left: "Socks only",
        right: "Rally on",
        note: "Getting ready for practice. Not a before-and-after of any result.",
      },
      included: { headline: "In the box" },
      howItWorks: { headline: "3 steps / under a minute" },
      versus: { headline: "Rally vs tube sleeve vs tape" },
      review: { headline: "From the sideline", reviewId: "crystal" },
    },
    description: [
      "The Rally Heel Sleeve is game-day kit for growing athletes: a slim knitted sleeve that covers the heel and ankle, with one strap that crosses over the foot and wraps round the back of the heel. It slides under socks and laces into cleats, basketball shoes and spikes.",
      "Your athlete sets the snugness: pull it on, wrap the strap, press it closed. After one run-through, most kids do it themselves, and it's on before the warm-up starts.",
      "Four sizes from youth 3 to adult 11, four colours from Night to Signal, and it washes cold in a mesh bag. Keep one pair in the kit bag and one in the wash. Sore heels? Get them checked by a doctor or physio first.",
    ],
    whyLove: [
      {
        title: "Built like kit",
        body: "A slim knit that sits under socks and goes into cleats, basketball shoes and spikes.",
      },
      {
        title: "One strap, set by your athlete",
        body: "It crosses over the foot and wraps round the heel. Snug, not tight.",
      },
      {
        title: "Sized for growing feet",
        body: "Four sizes by shoe size and ankle, youth 3 to adult 11. Between sizes? Go up one.",
      },
      {
        title: "Kit-bag care",
        body: "Strap closed, mesh bag, cold wash, air dry. Back in the bag for the next session.",
      },
      {
        title: "Team colours",
        body: "Night, Royal, Lime or Signal. Match the kit or mix the pair.",
      },
      {
        title: "Packs for the season",
        body: "A pair covers both feet. Two pairs means one is always clean.",
      },
    ],
    problem: {
      eyebrow: "Why Rally",
      headline: "Kids don't wear kit that looks like medicine",
      image: "life-kitbag",
      body: [
        "Most heel supports look like they came off a pharmacy shelf: beige, bulky and nothing a 12-year-old wants to wear in front of the team.",
        "Rally is built like the rest of the kit: slim, in team colours, and quick to put on in the locker room. Our job is a sleeve that gets worn. Anything about sore heels is a job for a doctor or physio.",
      ],
    },
    useCases: {
      headline: "Every sport in the bag",
      items: [
        {
          title: "Soccer",
          body: "Under the sock, under the shin guard, into the cleat.",
          image: "life-soccer",
        },
        {
          title: "Basketball",
          body: "Low-profile enough for high-tops and court shoes.",
          image: "life-basketball",
        },
        {
          title: "Gymnastics",
          body: "Light enough for the beam and the floor. Check with the coach first.",
          image: "life-gymnastics",
        },
        {
          title: "Training nights",
          body: "Two practices a week and a game on Saturday: one pair on, one in the wash.",
          image: "adv-practice",
        },
      ],
    },
    calloutsHeadline: "Anatomy / Rally Heel Sleeve",
    promise: {
      headline: "The Rally deal",
      body: [
        "We build kit. If the Rally sleeve doesn't earn its spot in the kit bag in {days} days, send it back for a full refund, worn or not. Wrong size? We'll swap it free.",
        "Anything we haven't confirmed yet is marked on this page. No invented stats, no borrowed experts.",
      ],
      signoff: "Team Rally",
    },
    proofLine: "{customers} sports families kit up with Rally",
    pressHeadline: "In the press",
    ugcHeadline: "From the kit bag",
    expertHeadline: "Coach's corner",
    qnaHeadline: "Questions / answered",
    kitHeadline: "More kit",
    guaranteeHeadline: "30-day fit guarantee / free size swaps",
    finalCta: {
      headline: "Kit up for the season",
      body: "{rating}/5 from {count} reviews. Free shipping over {free}, free size swaps and {days} days to return it.",
      cta: "Get the Rally sleeve",
    },
    stripHeadline: "Game day, every day",
    reviewsHeadline: "Sideline reports",
    reviewsSub: "{rating}/5 from {count} sideline reports",
    valuePropsHeadline: "Made for the kit bag",
    valuePropsSub:
      "Everything about the sleeve is built around how kids actually get ready for a game.",
    valueProps: [
      {
        headline: "Fits where the action is",
        body: "A slim knit made to sit under socks inside cleats and sports shoes, so it doesn't change how the shoe fits. We're testing it in common youth cleats before launch.",
        image: "life-soccer",
      },
      {
        headline: "One strap, set by the athlete",
        body: "The strap crosses over the foot and wraps round the back of the heel. Snug for games, a touch looser for practice: their call.",
        image: "step-strap",
      },
      {
        headline: "Sized like shoes",
        body: "S to XL by shoe size and ankle measurement. Between sizes, go up one.",
        image: "pair-pack",
      },
      {
        headline: "Wash it, pack it, play",
        body: "Fasten the strap, mesh bag, cold wash, air dry. A second pair means one's always clean.",
        image: "life-kitbag",
      },
    ],
    howItWorksHeadline: "Kit up in 3",
    comparisonHeadline: "Rally vs the alternatives",
    closingHeadline: "Before the whistle",
    faqHeadline: "FAQ",
    footerBlurb:
      "Rally is a provisional brand. Orders aren't open yet: this store is still in development.",
  },
  advertorial: {
    kicker: "Rally Kit Notes / Issue 01",
    headline: "9 reasons club families pack a heel sleeve in the kit bag",
    dek: "What goes in the bag, what stays home, and where a sleeve fits in a long season.",
    byline: "Rally editorial (concept byline)",
    readTime: "4 min read",
    leadImage: "adv-lead",
    leadCaption: "The mudroom bench, Saturday 7:40 am.",
    intro: [
      "Club seasons are long. Saturday tournaments, two practices a week, a growth spurt somewhere in the middle. Most families end up with a kit bag that's half gear, half guesswork.",
      "A heel sleeve is one of the small things more and more of them pack. Here's why, and where it fits. (One thing first: if your child has heel pain, get it checked by a doctor or physio. A sleeve isn't a treatment.)",
    ],
    sections: [
      {
        title: "It's kit, not medicine",
        body: [
          "It looks and feels like sports gear: a black knit with team-coloured trim. Kids wear it like shin guards, not like a bandage.",
        ],
        image: "life-soccer",
      },
      {
        title: "It fits inside the cleat",
        body: [
          "The knit is slim and sits under the sock, so cleats lace up the way they always do. We're testing it in the most common youth cleats before launch.",
        ],
        image: "step-lace",
      },
      {
        title: "The strap does the work",
        body: [
          "One strap wraps the ankle in a figure-8 and crosses behind the heel. Your athlete chooses how snug.",
        ],
        image: "step-strap",
      },
      {
        title: "It's on in under a minute",
        body: [
          "Slide it on, wrap the strap, lace up. After one practice run at home, most kids do it themselves on the bench.",
        ],
        image: "gallery-in-use",
      },
      {
        title: "It works across sports",
        body: [
          "Soccer cleats, basketball shoes, track spikes, gymnastics barefoot. One sleeve, every season.",
        ],
        image: "adv-court",
        caption: "Competitor photo, used as a placeholder",
      },
      {
        title: "Sizing is shoe-simple",
        body: [
          "S to XL by shoe size and ankle measurement. Between sizes, go up one.",
        ],
        image: "pair-pack",
      },
      {
        title: "Pairs make sense",
        body: [
          "Most families buy two so both feet match, and two pairs so one is always washed and ready.",
        ],
        image: "life-kitbag",
      },
      {
        title: "It washes like the rest of the kit",
        body: [
          "Strap fastened, mesh bag, cold wash, air dry. Done by the next session.",
        ],
        image: "kit-flatlay",
      },
      {
        title: "Kids ask for it",
        body: [
          "The best gear is the gear they actually wear. Ours looks the part, in black or with blue, green or red trim.",
        ],
        image: "adv-team",
        caption: "Competitor photo, used as a placeholder",
      },
    ],
    closing: {
      headline: "Rally Heel Sleeve",
      body: "Slim knit. Figure-8 heel strap. Four sizes, four colours. Kit up, strap in, play on.",
      cta: "See the Rally Heel Sleeve",
    },
  },
  advertorialSlug: "9-reasons-club-families-pack-a-heel-sleeve",
  store: {
    motion: "shutter",
    nav: {
      shop: "Shop",
      product: "Heel Sleeve",
      how: "How it works",
      journal: "Kit notes",
      about: "About",
    },
    products: {
      sleeve: {
        name: "Rally Heel Sleeve",
        blurb:
          "Slim knit compression sleeve with a figure-8 heel strap. Fits inside cleats.",
      },
      "game-day-kit": {
        name: "Game Day Kit",
        blurb:
          "Two heel sleeves, a mesh wash bag and a sizing card. Bag-ready.",
      },
      "knee-sleeve": {
        name: "Rally Knee Sleeve",
        blurb: "Matching knit knee sleeve for court and field.",
      },
      "wash-bag": {
        name: "Mesh Wash Bag",
        blurb: "Keeps straps from snagging in the wash. Fits four sleeves.",
      },
      "gift-card": {
        name: "Rally Gift Card",
        blurb: "Digital gift card. Sent by email.",
      },
    },
    colourNames: {
      black: "Night",
      blue: "Royal",
      green: "Lime",
      red: "Signal",
    },
    home: {
      hero: {
        eyebrow: "Rally / Heel sleeve",
        headline: "Kit up. Strap in. Play on.",
        sub: "A slim heel sleeve that laces into cleats and lives in the kit bag. Four sizes, four colours, one strap round the heel.",
        cta: "Shop the sleeve",
        secondary: "How it works",
        image: "hero-rally",
      },
      ticker: [
        "Fits inside cleats",
        "Figure-8 heel strap",
        "4 sizes",
        "4 colours",
        "Machine-wash cold",
        "Pairs and 2-pair packs",
      ],
      featured: {
        eyebrow: "Colours / 04",
        headline: "Night, Royal, Lime, Signal.",
        body: "Same sleeve, four trims. Match the team kit or don't.",
        cta: "Pick a colour",
      },
      angles: {
        eyebrow: "360 / 36 frames",
        headline: "Every angle of the kit.",
        callouts: [
          ["Outer side", "Slim knit, made to sit inside the cleat."],
          ["Heel", "The strap crosses behind the heel."],
          ["Inner side", "Hook-and-loop strap: set the snugness."],
          ["Front", "Open toe. Socks and cleats go on as usual."],
        ],
      },
      howHeadline: "Kit up in 3",
      reviewsHeadline: "Sideline reports",
      accessoriesHeadline: "More kit",
      story: {
        headline: "Built for the kit bag",
        body: "Rally makes gear for kids who live in their cleats. The heel sleeve sits with the shin guards: slim, strapped, ready.",
        image: "life-sideline",
        cta: "About Rally",
      },
      journalHeadline: "Kit notes",
      newsletter: {
        headline: "Season updates",
        body: "New colours, sizing tips and team-pack offers. A few emails a season.",
        cta: "Sign up",
        success: "Sign-up isn't connected yet, so nothing was sent.",
      },
    },
    shop: {
      headline: "Shop / All kit",
      sub: "The heel sleeve in four colours, plus kit to go with it.",
    },
    about: {
      headline: "Gear for kids who live in their cleats",
      intro:
        "Rally started on the sideline. We wanted a heel sleeve that looked like sports kit, fit inside a cleat and that kids would actually wear.",
      image: "hero-rally",
      sections: [
        {
          title: "Kit, not medicine",
          body: "Our sleeve is sports gear. If your child has heel pain, a doctor or physio comes first; a sleeve doesn't replace their advice.",
          image: "life-soccer",
        },
        {
          title: "Made to be worn",
          body: "Slim knit, one strap, four colours. Gear only works if it comes out of the bag.",
          image: "life-kitbag",
        },
      ],
      values: [
        { title: "Direct", body: "Plain facts, no hype." },
        {
          title: "Team-first",
          body: "Built for how families actually get to games.",
        },
        {
          title: "Honest",
          body: "Unconfirmed specs and terms are marked TBC.",
        },
      ],
    },
    contact: {
      headline: "Contact",
      body: "Sizing, orders, team packs. One form, read by a person.",
    },
    cart: {
      empty: "Your kit bag is empty.",
      upsell: "Add to the kit",
    },
    thankYou: {
      headline: "Kit secured.",
      body: "Orders aren't open yet: this store is in development, so nothing was charged and nothing ships.",
    },
    notFound: {
      headline: "404 / Out of bounds",
      body: "This page doesn't exist. Back to the shop.",
    },
  },
};
