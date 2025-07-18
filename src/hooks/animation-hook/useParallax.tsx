"use client";

import { useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import type { ParallaxConfig } from "@/types";

export function useParallax(config: ParallaxConfig) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], config.y);
  const opacity = useTransform(scrollYProgress, [0, 0.5], config.opacity);
  const scale = useTransform(scrollYProgress, [0, 0.5], config.scale);

  return { containerRef, y, opacity, scale, scrollYProgress };
}
