"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { AnimatedButton } from "./Button";

interface ShowMoreButtonProps {
  onClick: () => void;
  loading?: boolean;
}

export function ShowMoreButton({
  onClick,
  loading = false,
}: ShowMoreButtonProps) {
  return (
    <motion.div
      className="flex justify-center mt-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <AnimatedButton
        onClick={onClick}
        // disabled={loading}
        className="bg-white border-2 border-[#2a849a] text-[#2a849a] hover:bg-[#2a849a] hover:text-white px-8 py-3 rounded-full font-medium transition-all duration-300 shadow-sm hover:shadow-md"
        // asChild
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="flex items-center space-x-2"
        >
          <span>{loading ? "Loading..." : "Show More"}</span>
          <motion.div
            animate={{
              rotate: loading ? 360 : 0,
              y: loading ? 0 : [0, 2, 0],
            }}
            transition={{
              rotate: {
                duration: 1,
                repeat: loading ? Number.POSITIVE_INFINITY : 0,
              },
              y: {
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              },
            }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
        </motion.button>
      </AnimatedButton>
    </motion.div>
  );
}
