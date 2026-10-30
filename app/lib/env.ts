import { createContext } from "react-router";

export type Env = {
  MOCK_SHOP?: string;
  PRIVATE_STOREFRONT_API_TOKEN?: string;
  /** The running offer: an offer id from app/content/offers.ts. Defaults to "standard". */
  PUBLIC_ACTIVE_OFFER?: string;
  PUBLIC_CHECKOUT_DOMAIN?: string;
  PUBLIC_STORE_DOMAIN?: string;
  PUBLIC_STOREFRONT_ID?: string;
  PUBLIC_CUSTOMER_ACCOUNT_API_CLIENT_ID?: string;
  SESSION_SECRET?: string;
  SHOP_ID?: string;
};

export const envContext = createContext<Env>();
