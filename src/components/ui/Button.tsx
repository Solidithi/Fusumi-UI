"use client";

import type React from "react";

// import { button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { forwardRef } from "react";

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  href?: string;
  disabled?: boolean; 
}

export const AnimatedButton = forwardRef<
  HTMLButtonElement,
  AnimatedButtonProps
>(({ children, className, variant = "default", size, href, ...props }, ref) => {
  return (
    // <button>
    <motion.button
      whileHover={{
        scale: 1.03,
      }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
      ref={ref}
      className={`relative overflow-hidden group ${className}`}
      {...props}
    >
      <motion.div
        initial={{ x: "-100%" }}
        whileHover={{ x: "100%" }}
        transition={{ duration: 0.6 }}
      />
      {children}
    </motion.button>
    // </button>
  );
});

AnimatedButton.displayName = "AnimatedButton";
