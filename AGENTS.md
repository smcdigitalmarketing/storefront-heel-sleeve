# Shopify Hydrogen development

This storefront is scaffolded from Shopify's Hydrogen React Router template. See the README for framework-specific details.

Use the [Shopify AI Toolkit](https://shopify.dev/docs/apps/build/ai-toolkit) for all Shopify API and platform work. If missing, install it in the agent host per that page (or `npx skills add Shopify/shopify-ai-toolkit --list` for skill-compatible hosts).

## No store yet?

Until a store is connected, this project reads [mock.shop](https://mock.shop): a public, auth-free Storefront API backed by fictional stores. There are more than 100 sample stores, each on its own host with its own catalog.

- The directory at https://mock.shop/llms.txt lists every store with what it sells and its API URL. The default, `mock.shop` itself, is apparel basics.
- To build against a different store, set `PUBLIC_STORE_DOMAIN` in `.env` to that store's host (for example `pets.mock.shop`) and leave `PRIVATE_STOREFRONT_API_TOKEN` empty. Each store describes its own catalog at `https://<store>.mock.shop/llms.txt`.
- Carts work; checkout is mocked (no payment, no real order), and the Customer Account API isn't available.
- To connect a real store, run `npx shopify hydrogen link`, then `npx shopify hydrogen env pull` to pull its environment into `.env`. Fill in any secret values the command reports it couldn't pull. On Oxygen, a linked storefront injects `PUBLIC_STORE_DOMAIN`, `PUBLIC_STOREFRONT_ID`, and `PRIVATE_STOREFRONT_API_TOKEN` for you. `PUBLIC_STOREFRONT_ID` is optional for Storefront API access; it enables Hydrogen analytics, and no other analytics IDs are needed.

## Styling rules

shadcn/ui is the source of styling truth for this storefront.

1. **Brand looks come only from shadcn's theme variables in `app/app.css`:**
   colours, `--radius`, `--font-sans` and `--font-heading`.
   - `app/app.css` holds shadcn's structure and nothing else: imports, the dark
     variant, `@theme inline`, `:root`, `.dark` and `@layer base`.
   - Never add other CSS files, selectors, `<style>` tags or inline styles.
   - The one exception is an inline `backgroundColor` or CSS variable fed from
     Shopify data, such as a swatch colour.
2. **Every interactive or overlay element is a shadcn component** from
   `app/components/ui/`. That covers Sheet, Dialog, Select, Checkbox,
   ToggleGroup, Accordion, Button, Input, Pagination and the rest.
   - Never use native `<button>`, `<input>` (except `type="hidden"`),
     `<select>`, `<textarea>`, `<details>` or `<dialog>`.
   - Never hand-roll a drawer, modal, popover, menu or toast.
3. **Compose before you customise.** If shadcn has no component for something,
   compose it from shadcn components in `app/components/`. If a new look is
   needed, add a variant to the component in `app/components/ui/`.
4. **Utilities in feature components are for layout and type scale.** Colour
   comes only from tokens (`bg-primary`, `text-muted-foreground`, `border`).
   Arbitrary colours (`bg-[#…]`) and palette colours (`text-gray-500`) aren't
   allowed.
5. **Add components from outside the repo,** so the CLI doesn't resolve the local
   `shadcn` package: `npx shadcn@latest add -c <path-to-repo> <component>`.
6. **Run `npm run check:styles` before committing.** It enforces rules 1, 2
   and 4.

Hydrogen's `register(...)` form helpers return props for a native element.
Spread them onto the shadcn `Button` or `Input`, which render that element.
Hydrogen's `ShopPayButton` is used as it is.

## Content rules

- No fake urgency: no countdowns, stock warnings or "selling out".
- No invented experts, reviewers or endorsements, and no unverifiable sales
  counts.
- Placeholder proof (ratings, reviews, press) stays labelled until real data
  replaces it.

## Brand: Rally

This storefront sells the Rally youth heel support sleeve. Its design and copy come from the retro-camera `apps/recoverx`, concept `rally` mock store. Its theme lives in `app/app.css`.

- No medical or health claims. Don't name conditions (Sever's disease, growth plates), promise pain relief or recovery, or cite doctors or clinicians. Describe the sleeve mechanically and point parents to a doctor or physio.
- Lime (`primary`) is a fill colour only: it reads at 1.16:1 as text on Chalk. Links use `foreground` text with a lime underline (see the `link` variants in `components/ui/button.tsx` and `badge.tsx`).
