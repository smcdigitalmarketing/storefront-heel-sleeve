# Rally storefront

The Shopify Hydrogen storefront on Oxygen for the Rally youth heel support sleeve. The brand direction (copy, palette, fonts, layout) comes from the retro-camera `apps/recoverx`, concept `rally` mock store. It's built from Shopify's
[Hydrogen React Router template](https://github.com/Shopify/hydrogen/tree/main/templates/react-router)
(React Router 7 in framework mode with SSR, plus Vite and Mini Oxygen), and every
piece of UI is restyled with [shadcn/ui](https://ui.shadcn.com) on Tailwind CSS v4.

## Pages

- `/`: home
- `/products/:handle`: product detail (gallery, variants, add to cart, Shop Pay)
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

| Script                 | Does                                                          |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Start the Vite dev server with Mini Oxygen.                   |
| `npm run dev:https`    | Start the dev server with trusted local HTTPS.                |
| `npm run build`        | Production React Router build for Oxygen.                     |
| `npm run preview`      | Build and preview locally with Vite and Mini Oxygen.          |
| `npm run deploy`       | Deploy to Oxygen with the Shopify CLI.                        |
| `npm run typecheck`    | React Router typegen, TypeScript and Hydrogen GraphQL checks. |
| `npm run check:styles` | Fail on any styling that doesn't come from shadcn/ui.         |

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
