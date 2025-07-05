"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";

export function useInViewAnimation(options = { once: true, margin: "-100px" }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, options as any);

  return { ref, isInView };
}
