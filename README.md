# Rally storefront

The Shopify Hydrogen storefront on Oxygen for the Rally youth heel support sleeve. The brand direction (copy, palette, fonts, layout) comes from the retro-camera `apps/recoverx`, concept `rally` mock store. It's built from Shopify's
[Hydrogen React Router template](https://github.com/Shopify/hydrogen/tree/main/templates/react-router)
(React Router 7 in framework mode with SSR, plus Vite and Mini Oxygen), and every
piece of UI is restyled with [shadcn/ui](https://ui.shadcn.com) on Tailwind CSS v4.

## Pages

- `/`: the Rally home (game-day hero, ticker, featured colours, reviews, story, newsletter)
- `/products/rally-heel-sleeve`: the SOP product page. Seven sections in a fixed order:
  - above the fold, headline first, with the 8-slide gallery
  - buy box (3 bundles in a spec sheet, then a size and colour per sleeve, with the size guide)
  - under the button, with the heel note
  - details
  - social proof
  - value props
  - closing
  - plus a sticky add-to-cart bar
- `/products/:handle`: every other product (gallery, variants, add to cart, Shop Pay)
- `/about`, `/how-it-works`, `/faq`, `/contact`, `/policies/:policy`
- `/journal` and `/journal/:slug`: the advertorial and the size and fit guide
- `/collections` and `/collections/:handle`: collections, with filters, sort and
  pagination
- `/search`: product search, also the no-JS fallback for the search drawer
- `/cart`: cart page, also the no-JS fallback for the cart drawer
- `/account`: Customer Account sign-in, log out and order history

## Run it

Node.js 22 (22.12 or later) or 24.

```bash
npm install
npx shopify hydrogen link       # once: connect this folder to the store's Hydrogen storefront
npx shopify hydrogen env pull   # writes the storefront's variables to .env
npm run dev                     # http://localhost:5173
```

- **No store linked yet?** Without a private Storefront API token, the app shows
  [mock.shop](https://mock.shop) demo data. You can force this with `MOCK_SHOP=1`
  in `.env`.
- **On Oxygen,** the linked storefront injects `PUBLIC_STORE_DOMAIN`,
  `PUBLIC_STOREFRONT_ID` and `PRIVATE_STOREFRONT_API_TOKEN` itself.
- **Customer Account sign-in needs trusted local HTTPS.** Run `npm run dev:https`
  and open <https://local.tryhydrogen.dev:5173>.

## Before the store exists: the mock.shop stand-in

No Shopify store is linked yet, so development runs on mock.shop:

- **The catalog** is MVSE (`mvse.mock.shop`), the default store in `app/lib/shop.ts`. `PUBLIC_STORE_DOMAIN` overrides it.
- **The SOP product page** is `/products/rally-heel-sleeve` (`app/routes/hero-product.tsx`).
  - In mock mode, its variants come from MVSE's `mvse-libertee` tee: Color × Size, S to XL.
  - Its colours map to our colourways (Black is Night, Navy is Royal, Lime is Lime, Pink is Signal). See `app/content/hero-product.ts`.
  - So the page shows sleeve imagery and brand names, while the cart holds real mock.shop variants at mock.shop prices.
- **Once the store is linked,** the same route reads the real `rally-heel-sleeve` product. Its `Color` values must be the brand colour names in `brand.store.colourNames` (Night, Royal, Lime, Signal) and its `Size` values S, M, L and XL. No code changes are needed.
- **mock.shop has no** metafields, metaobjects, bundles or discounts. The cart therefore shows unit prices without bundle savings, and accessories can't be added yet.
- **Running more than one storefront locally:** every storefront on `localhost` shares Hydrogen's `cart` cookie, whatever the port. After using another one, its cart doesn't exist in this store and adds fail with "The specified cart does not exist". Clear the `cart` cookie for `localhost`.

## The fit step

The sleeve is sold by the sleeve, and each one needs a size:

- **No size is preselected.** A wrong size is the likeliest return. The first size picked fills every sleeve still without one; later picks change only that sleeve.
- **Until every sleeve has a size,** the button reads "Choose a size" and points at the fit step.
- **Without JavaScript,** size links (`?size=M`) reload the page with that size, and the plain form adds the default bundle in it. With no size, the server-rendered button stays disabled.
- **The size guide** (a shadcn Dialog) shows the competitor's size chart, labelled, until the supplier confirms sizes.

## Offers

The store runs one offer at a time:

- `PUBLIC_ACTIVE_OFFER` holds an offer id from `app/content/offers.ts`: `standard` (the default) or `black-friday`.
- In development, add `?offer=black-friday` to a URL to preview that offer on that page.
- **Prices, bundles and gifts** come from `app/content/offers.ts` and are labelled illustrative.
- **Bundles** add one cart line per colour and size variant, tagged with hidden `_bundle` and `_offer` line attributes (`app/lib/bundle-cart.ts`).

## Content

The brand's copy and placeholder proof are typed files in `app/content/`, ported from the retro-camera mock (`apps/recoverx`, concept `rally`) with the same field names:

| File                     | Holds                                                                                                          |
| ------------------------ | -------------------------------------------------------------------------------------------------------------- |
| `brand.ts`               | Brand copy, product page copy, the advertorial, store page copy, colour and bundle names                       |
| `product.ts`             | Facts (each with a status), the heel note, materials, care, fit tips, how it works, comparison, FAQ, policies  |
| `catalog.ts`             | Colours, sizes (shoe size and ankle range, with their source), the accessories                                 |
| `offers.ts`              | Bundles, prices, compare-at and gifts for each offer                                                           |
| `proof.ts`, `reviews.ts` | The rating, reviews, Q&A, press, expert, guarantee and shipping terms. All placeholders, labelled on the page. |
| `store-pages.ts`         | FAQ categories, policies, the fit guide steps                                                                  |
| `images.ts`              | The image registry. Every image is a competitor stand-in for now, labelled where shown.                        |

Anything not confirmed carries a `PlaceholderTag` (a dashed badge) on the page.

**No health claims.** `npm run check:content` fails on claims words (cure, heal, treat, relief, prevent, medical-grade, Sever's and so on) and the competitor's names. The only allowed mentions are the heel note (`HEEL_NOTE`) and the FAQ answer that says the sleeve isn't a treatment.

## Open decisions

- **Bundle pricing:** Shopify automatic discounts or Shopify Bundles. This needs the store.
- **Gifts:** how the parent guide and wash bag are fulfilled.
- **Reviews:** a reviews provider to replace the placeholder rating, reviews and Q&A.
- **Imagery:** a shoot of our own sleeve to replace every competitor stand-in image, and a silent demo video for the gallery's last slide.
- **Sizes and specs:** supplier confirmation of the size chart, colours and the specs marked "to be confirmed".
- **Policies:** shipping, the free-shipping threshold, returns and the guarantee.
- **Content editing:** whether copy moves from `app/content/` to Shopify metaobjects so the team can edit it.

## Deploy

Pushing to `main` deploys through the GitHub Actions workflow that the Hydrogen
channel adds (`.github/workflows/oxygen-deployment-*.yml`):

- `main` goes to the production environment.
- Other branches get preview deployments.

Oxygen environments on a development store are private. To share one, use
**Share deployment** in the Hydrogen channel.

## Styling

shadcn/ui is the source of styling truth. The full rules are in
[AGENTS.md](./AGENTS.md#styling-rules). In short:

- **The theme lives in `app/app.css`:** shadcn's CSS variables, and nothing else.
  The brand's colours, radius and fonts are set there.
- **`app/components/ui/` holds the shadcn components.** Add more from outside the
  repo, so the CLI doesn't pick up the local `shadcn` package:
  `npx shadcn@latest add -c <path-to-repo> <component>`.
- **Feature components compose shadcn components.** They use Tailwind utilities for
  layout and theme tokens for colour (`text-muted-foreground`, `bg-primary`).
- **No other CSS, inline styles, native form or overlay elements, or raw colours.**
  `npm run check:styles` enforces this.

## Scripts

| Script                  | Does                                                                                                                                                |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `npm run dev`           | Start the Vite dev server with Mini Oxygen.                                                                                                         |
| `npm run dev:https`     | Start the dev server with trusted local HTTPS.                                                                                                      |
| `npm run build`         | Production React Router build for Oxygen.                                                                                                           |
| `npm run preview`       | Build and preview locally with Vite and Mini Oxygen.                                                                                                |
| `npm run deploy`        | Deploy to Oxygen with the Shopify CLI.                                                                                                              |
| `npm run typecheck`     | React Router typegen, TypeScript and Hydrogen GraphQL checks.                                                                                       |
| `npm run check:styles`  | Fail on any styling that doesn't come from shadcn/ui.                                                                                               |
| `npm run check:content` | Check a running server's pages: SOP order, bundles, the fit step, placeholder labels and the claims lint (`BASE`, default `http://localhost:3102`). |

## Where things live

| What                                           | Where                                |
| ---------------------------------------------- | ------------------------------------ |
| Routes                                         | `app/routes/`                        |
| Shared UI built from shadcn components         | `app/components/`                    |
| shadcn components (generated, owned by us)     | `app/components/ui/`                 |
| Theme (shadcn variables, brand colours, fonts) | `app/app.css`                        |
| Data, queries and helpers                      | `app/lib/`                           |
| Which drawer (Sheet) is open                   | `app/lib/cart-drawer.ts`             |
| Announcement bar entries                       | `app/components/AnnouncementBar.tsx` |

## License

MIT, from Shopify's template. See [LICENSE](./LICENSE).
