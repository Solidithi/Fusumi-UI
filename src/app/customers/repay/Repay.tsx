"use client";
import { AnimatedButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Sidebar } from "@/components/ui/SideBar";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Repay() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Add sidebar state

  return (
    <div className="min-h-screen bg-white flex ">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="repay" 
        type="customers"  
      />
      <div className="flex  items-center justify-center w-full">
        <motion.div
          className="w-[500px] p-10 rounded-xl mx-auto bg-[#FFF8F1] flex flex-col justify-center items-center gap-5 text-black"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            type: "spring",
            stiffness: 100,
          }}
        >
          <motion.span
            className="text-xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Repay
          </motion.span>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Label htmlFor="nft-address" className="text-sm">
              NFT Address
            </Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="nft-address"
                placeholder="Enter nft address"
                className="mt-1 bg-white/90 border-white/30 focus:border-white focus:ring-white/50 placeholder:text-gray-500 placeholder:opacity-70 transition-all duration-300"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Label htmlFor="amount" className="text-sm">
              Amount
            </Label>
            <motion.div
              whileFocus={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Input
                id="Amount"
                placeholder="Enter amount"
                className="mt-1 bg-white/90 border-white/30 focus:border-white focus:ring-white/50 placeholder:text-gray-500 placeholder:opacity-70 transition-all duration-300"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <AnimatedButton className="bg-[#2A849A] text-white w-full rounded-lg p-1">
              Deposit
            </AnimatedButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
