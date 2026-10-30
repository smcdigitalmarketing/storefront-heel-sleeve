export const POLICY_SLUGS = [
  "shipping",
  "returns",
  "privacy",
  "terms",
] as const;
export type PolicySlug = (typeof POLICY_SLUGS)[number];
