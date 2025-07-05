"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { AnimatedButton } from "../ui/Button";
import {
  containerVariants,
  headerVariants,
  itemVariants,
} from "@/lib/animation";
import { NAVIGATION_ITEMS } from "@/lib/constant";
import { useRouter } from "next/navigation";

export function Header() {
  const route = useRouter();
  const handleClick = () => {
    route.push("/business/dashboard");
  };
  const handleLogoClick = () => {
    route.push("/");
  };
  return (
    <motion.header
      className="bg-[#2a849a] px-6 py-4 relative z-10"
      variants={headerVariants as any}
      initial="hidden"
      animate="visible"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <motion.div
          className="flex items-center space-x-2 
          hover:cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
          onClick={handleLogoClick}
        >
          <motion.div
            className="w-8 h-8 bg-white rounded flex items-center justify-center"
            whileHover={{ rotate: 360 }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[#2a849a] font-bold text-lg">PF</span>
          </motion.div>
          <span className="text-white text-xl font-semibold">PayFi</span>
        </motion.div>

        {/* Navigation */}
        <motion.nav
          className="hidden md:flex items-center space-x-8"
          variants={containerVariants as any}
          initial="hidden"
          animate="visible"
        >
          {NAVIGATION_ITEMS.map((item: any) => (
            <motion.div key={item.label} variants={itemVariants as any}>
              <Link
                href={item.href}
                className="text-white hover:text-white/80 transition-colors relative group"
              >
                {item.label}
                <motion.div
                  className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white"
                  whileHover={{ width: "100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            </motion.div>
          ))}
        </motion.nav>

        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <AnimatedButton
            variant="secondary"
            className="bg-white text-[#2a849a] hover:bg-white/90 rounded-full py-3 px-6"
            onClick={handleClick}
          >
            Dashboard
          </AnimatedButton>
        </motion.div>
      </div>
    </motion.header>
  );
}
