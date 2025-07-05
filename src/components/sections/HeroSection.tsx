"use client";

import { useInViewAnimation } from "@/hooks/animation-hook/useInViewAnimation";
import {
  bounceAnimation,
  containerVariants,
  gradientVariants,
  itemVariants,
  textVariants,
} from "@/lib/animation";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AnimatedButton } from "../ui/Button";

interface HeroSectionProps {
  opacity: any;
  scale: any;
}

export function HeroSection({ opacity, scale }: HeroSectionProps) {
  const { ref: heroRef, isInView } = useInViewAnimation();

  return (
    <motion.main
      ref={heroRef}
      className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 text-center relative"
      style={{ opacity, scale }}
    >
      <motion.div
        className="max-w-4xl mx-auto space-y-8"
        variants={containerVariants as any}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="space-y-4">
          <motion.h1
            className="text-6xl md:text-7xl lg:text-8xl font-bold text-[#000000] leading-tight"
            variants={textVariants as any}
          >
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Smart
            </motion.span>{" "}
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Payment
            </motion.span>
          </motion.h1>

          <motion.h2
            className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight"
            variants={gradientVariants as any}
          >
            <motion.span
              className="bg-gradient-to-r from-[#2a849a] via-[#2a849a] to-[#F9C0C0] bg-clip-text text-transparent bg-[length:200%_100%]"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Revolution
            </motion.span>
          </motion.h2>
        </div>

        <motion.p
          className="text-[#33363f] text-lg md:text-xl max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants as any}
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          Transform your business with blockchain-powered NFT invoicing. Secure,
          transparent, and lightning-fast payment solutions for the modern
          enterprise.
        </motion.p>

        {/* CTA Button */}
        <motion.div
          className="pt-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }
          }
          transition={{
            duration: 0.6,
            delay: 1.2,
            type: "spring",
            stiffness: 200,
          }}
        >
          <AnimatedButton className="bg-[#2a849a] hover:bg-[#2a849a]/90 text-white px-8 py-3 rounded-full text-lg">
            Dashboard
          </AnimatedButton>
        </motion.div>
      </motion.div>

      {/* Down Arrow */}
      <motion.div
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.5 }}
      >
        <motion.div
          animate={bounceAnimation as any}
          whileHover={{ scale: 1.2 }}
        >
          <ChevronDown className="w-6 h-6 text-[#33363f] cursor-pointer" />
        </motion.div>
      </motion.div>
    </motion.main>
  );
}
