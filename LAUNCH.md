# Launching Rally: from mock.shop to a real store

The store runs today on a [mock.shop](https://mock.shop) stand-in (see the README). Everything works except taking real orders for the Rally heel sleeve. This is the list of what's needed to get there, in order.

- **You**: done in Shopify (the admin, the Dev Dashboard or the Hydrogen channel).
- **Dev**: a code change in this repo.

## 1. Create the store and connect this repo (you)

- [ ] Create a **development store** in the Shopify Dev Dashboard: United States, US dollars.
- [ ] Install the **Hydrogen** sales channel, then **Create storefront** → **Connect to an existing repository** → `smcdigitalmarketing/storefront-heel-sleeve`.
- [ ] Shopify opens a pull request adding `.github/workflows/oxygen-deployment-<id>.yml`. **Merge it.**
  - From then on, a push to `main` deploys to the production environment, and other branches get preview deployments.
  - Deployments on a development store are private. Share one with **Share deployment** in the Hydrogen channel.

## 2. Connect the code (dev)

- [ ] Link the repo and pull the storefront's variables into `.env`:

  ```bash
  npx shopify hydrogen link
  npx shopify hydrogen env pull
  ```

  This writes `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_ID`, `PRIVATE_STOREFRONT_API_TOKEN`, `SHOP_ID`, `PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID` and `SESSION_SECRET`. With a private token present, the app stops using mock.shop by itself; no code change. On Oxygen the linked storefront injects them.

- [ ] Add `npm run typecheck` and `npm run check:styles` to the deployment workflow, before the deploy step, so a failing check blocks the deploy.
- [ ] `npm run check:content` needs a running server. Run it before merging, against `npm run dev` on the linked store: `BASE=http://localhost:5173 npm run check:content` (its default is port 3102, the shared dev setup).

## 3. The product (you)

Create the Rally heel sleeve in Shopify:

- [ ] **Handle:** exactly `rally-heel-sleeve`. The product page lives at `/products/rally-heel-sleeve`.
- [ ] **Two options, named `Color` and `Size`.**
  - `Color` values, exactly: Night, Royal, Lime, Signal. They must match `brand.store.colourNames` in `app/content/brand.ts`.
  - `Size` values, exactly: S, M, L, XL.
  - A value that isn't on these lists doesn't show on the page.
- [ ] **Sixteen variants,** one per colour and size. The page sells single sleeves: a pair is two units.
- [ ] **Price:** each variant at the single-unit price, $34.99 per sleeve (compare-at $49.99). Bundle and offer prices are in `app/content/offers.ts`; see step 4 for how checkout matches them.
- [ ] **Inventory, SKU and weight** on every variant (weight feeds the shipping rates).
- [ ] **Images** on the product. The product page uses its own images; Shopify's show in the cart, checkout and emails.
- [ ] **Swatches (optional):** set a colour on each `Color` value. Without one, the page uses the swatch in `app/content/catalog.ts`.
- [ ] **Publish** it to the Hydrogen sales channel.
- [ ] **Accessories:** create `knee-sleeve`, `game-day-kit`, `wash-bag`, and `gift-card` (a Shopify gift card product), with exactly those handles: they match the catalog ids in `app/content/catalog.ts`, which the "Complete the kit" block uses. Their copy and prices are there too.

## 4. Bundle prices, gifts and offers (you and dev)

The page shows bundle prices from `app/content/offers.ts`, labelled illustrative. The cart charges Shopify's prices, so until a discount exists a bundle costs the unit price times the quantity at checkout.

| Bundle        | Standard                         | Black Friday                     |
| ------------- | -------------------------------- | -------------------------------- |
| ×1 sleeve     | $34.99                           | $29.99 + parent guide            |
| ×2, a pair    | $59.98 + parent guide            | $49.98 + parent guide + wash bag |
| ×4, two pairs | $99.96 + parent guide + wash bag | $84.96 + parent guide + wash bag |

- [ ] **Decide how checkout applies the bundle price** (one of the open decisions in the README):
  - **Automatic discounts** with a minimum quantity, one per bundle size, or a volume-discount app.
  - **A Shopify Function** (discount or cart transform). Every bundle line carries hidden `_bundle` and `_offer` attributes, so a Function can price exactly what the shopper chose on the page.
- [ ] **Gifts:** the parent guide (a digital download) and the mesh wash bag (a physical product). The wash bag ships, so it's a product with an automatic "Buy X get Y" discount or a line the store adds to the cart. The parent guide is a download: a digital-downloads app, or an email after purchase.
- [ ] **Black Friday:** set up its discounts ahead of time. To run it, set the environment variable `PUBLIC_ACTIVE_OFFER=black-friday` on the production environment (Hydrogen channel → **Storefront settings** → **Environments and variables**), then set it back to `standard`. The offer ids are `standard` and `black-friday`. The page shows no end date until one is set; there are no countdowns.
- [ ] **Dev:** once prices are confirmed and checkout matches them, update `app/content/offers.ts` and remove the "illustrative" labels.

## 5. Store settings (you)

- [ ] **Markets:** United States, USD. The content's prices are in US dollars and the storefront is set to US/EN (`app/lib/shop.ts`).
- [ ] **Shipping:** rates, and free shipping over $50. The page and the cart's free-shipping bar use the same threshold from `app/content/proof.ts`, so change both together. The page promises dispatch in 1–2 business days.
- [ ] **Payments:** Shopify Payments. On a development store, test orders go through Shopify's test gateway.
- [ ] **Policies** in Settings → Policies (refund, privacy, terms of service, shipping): checkout links to these. The store's own `/policies/*` pages read placeholder text from `app/content/store-pages.ts`; replace it with the final text (or dev switches the route to read Shopify's policies).
- [ ] **Customer accounts:** turn on the new customer accounts. The Hydrogen channel sets up the Customer Account API; add the production domain to its callback URLs once there is one.
- [ ] **Checkout and emails:** the logo and brand colours in the checkout editor, and in the order notification emails.
- [ ] **Cookie banner:** turn on Shopify's customer privacy banner. The storefront uses Shopify's default banner.

## 6. Code still to do once the store exists (dev)

- [ ] **"Complete the kit":** its Add buttons are disabled until they get the accessories' variant ids. Query the accessory products in the product route and pass them to `CompleteTheKit` (`variantIds`).
- [ ] **Bundles and gifts:** wire whatever step 4 decides.
- [ ] **Newsletter form:** connect it (Shopify customer marketing through the Storefront API, or the chosen email provider). Today it says sign-up isn't connected.
- [ ] **Contact form:** connect it to a form service or app. Hydrogen has no built-in contact form.
- [ ] **Reviews:** replace the placeholder rating, reviews and Q&A (`app/content/proof.ts`, `reviews.ts`) with the reviews provider.
- [ ] **Images:** replace the files in `public/images/` and their entries in `app/content/images.ts` with our own photography.
- [ ] **Gallery video:** the last slide is a labelled placeholder until the silent demo clip exists.
- [ ] **Content check:** `scripts/check-content.mjs` expects placeholder labels (illustrative counts, placeholder reviews). Update it as real content replaces them.

## 7. Content to confirm before launch (you)

Everything not yet confirmed carries a dashed "placeholder" label on the page. Each one needs a real answer, or comes off the page:

- [ ] **Prices and bundles** (step 4), and the gift values.
- [ ] **The rating, review count and customer count:** placeholders until real reviews exist.
- [ ] **Reviews, Q&A, press and expert quotes:** placeholders. No invented names, outlets or endorsements.
- [ ] **Guarantee, returns and warranty terms,** and the free-shipping threshold.
- [ ] **Sizes:** the size chart is the competitor's, labelled as such. The supplier confirms it before launch (`app/content/catalog.ts`).
- [ ] **No health claims,** ever. Product copy, reviews and ads describe the sleeve mechanically. `npm run check:content` fails on claims words; keep the heel note ("get heel pain checked") wherever heel pain comes up.
- [ ] **Images:** every photo is a competitor stand-in, replaced by a shoot of our own sleeve, plus a silent demo video for the gallery's last slide.
- [ ] **No fake urgency:** no countdowns, stock counts or sales counts. `npm run check:content` enforces this.

## 8. Test, then open (you and dev)

- [ ] **On a preview deployment:** the product page shows the real product (not the stand-in), every option adds the right variant, each bundle gets the right price at checkout, and the gifts arrive.
- [ ] **A test order** through Shopify's test gateway, including the confirmation email.
- [ ] **The checks pass:** `npm run typecheck`, `npm run check:styles` and `npm run check:content` against the linked store.
- [ ] **To take real orders,** the store moves off the development plan: pick a paid plan (or transfer the store to its owner).
- [ ] **Domain:** connect the custom domain to the production environment in the Hydrogen channel. Production deployments can then be public.
