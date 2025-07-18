import { AnimationVariants } from "@/types";

export const containerVariants: AnimationVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const itemVariants: AnimationVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const textVariants: AnimationVariants = {
  hidden: { y: 50, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const gradientVariants: AnimationVariants = {
  hidden: {
    y: 100,
    opacity: 0,
    backgroundPosition: "0% 50%",
  },
  visible: {
    y: 0,
    opacity: 1,
    backgroundPosition: "100% 50%",
    transition: {
      duration: 1,
      ease: "easeOut",
      backgroundPosition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
        ease: "easeInOut",
      },
    },
  },
};

export const headerVariants: AnimationVariants = {
  hidden: { y: -100, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export const floatingAnimation = {
  y: [0, -20, 0],
  scale: [1, 1.2, 1],
  transition: {
    duration: 3,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
};

export const bounceAnimation = {
  y: [0, 10, 0],
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
};
