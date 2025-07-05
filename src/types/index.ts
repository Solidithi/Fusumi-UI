export interface NavigationItem {
  label: string;
  href: string;
}

export interface AnimationVariants {
  hidden: any;
  visible: any;
}

export interface ParallaxConfig {
  y: [string, string];
  opacity: [number, number];
  scale: [number, number];
}
