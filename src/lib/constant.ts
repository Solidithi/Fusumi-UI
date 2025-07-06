export const NAVIGATION_ITEMS = [
  { label: "For User", href: "/customer" },
  { label: "For Business", href: "/business" },
  { label: "Market", href: "#" },
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
