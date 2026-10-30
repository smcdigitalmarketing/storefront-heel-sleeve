import { type RouteConfig, index, route } from "@react-router/dev/routes";

import { heroProduct } from "./content/hero-product";

export default [
  index("routes/home.tsx"),
  // The SOP page for the hero product, ahead of the generic product page.
  route(`products/${heroProduct.handle}`, "routes/hero-product.tsx"),
  route("products/:handle", "routes/product.tsx"),
  route("collections", "routes/collections.tsx"),
  route("collections/:handle", "routes/collection.tsx"),
  route("cart", "routes/cart.tsx"),
  route("search", "routes/search.tsx"),
  route("account", "routes/account.tsx"),
  // Flashpop's store pages, ported from the mock store.
  route("about", "routes/about.tsx"),
  route("how-it-works", "routes/how-it-works.tsx"),
  route("faq", "routes/faq.tsx"),
  route("contact", "routes/contact.tsx"),
  route("policies/:policy", "routes/policy.tsx"),
  route("journal", "routes/journal.tsx"),
  route("journal/:slug", "routes/journal-article.tsx"),
  route("*", "routes/catchall.tsx"),
] satisfies RouteConfig;
