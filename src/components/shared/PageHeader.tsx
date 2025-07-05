"use client";

import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import { AnimatedButton } from "../ui/Button";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  isBusiness?: boolean;
}

export function PageHeader({ title, subtitle, isBusiness }: PageHeaderProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="flex flex-col md:flex-row md:items-center md:justify-between mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants as any}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {title || "No infor"}
        </h1>
        <p className="text-gray-600">{subtitle || "No infor"}</p>
      </motion.div>

      {isBusiness && (
        <motion.div
          className="flex space-x-3 mt-4 md:mt-0"
          variants={itemVariants as any}
        >
          <AnimatedButton className="bg-[#2a849a] hover:bg-[#2a849a]/90 text-white pr-4 py-3 flex gap-3  justify-between rounded-lg">
            <Plus className="" />
            <span>Create offer</span>
          </AnimatedButton>

          <AnimatedButton className="bg-[#2a849a] hover:bg-[#2a849a]/90 text-white pr-4 py-3  flex gap-3  justify-between rounded-lg">
            <Plus className="" />
            <span>Create Invoice</span>
          </AnimatedButton>
        </motion.div>
      )}
    </motion.div>
  );
}
