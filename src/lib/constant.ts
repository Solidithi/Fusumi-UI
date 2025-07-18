export const NAVIGATION_ITEMS = [
  { label: "My Account", href: "/account" },
  { label: "Business", href: "/business/dashboard" },
  { label: "Coral Bay", href: "/corals" },
  { label: "Business Offers", href: "/offers" },
] as const;

export const COLORS = {
  primary: "#2a849a",
  background: "#fffdfb",
  text: "#000000",
  textSecondary: "#33363f",
  accent: "#f8f9fa",
} as const;

export const ANIMATION_DURATION = {
  fast: 0.3,
  normal: 0.6,
  slow: 0.8,
  extraSlow: 1.2,
} as const;
