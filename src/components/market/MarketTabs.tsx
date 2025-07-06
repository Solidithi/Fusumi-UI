"use client";

import { MarketplaceTab } from "@/types/market";
import { motion } from "framer-motion";

interface MarketplaceTabsProps {
  activeTab: MarketplaceTab;
  onTabChange: (tab: MarketplaceTab) => void;
}

export function MarketplaceTabs({
  activeTab,
  onTabChange,
}: MarketplaceTabsProps) {
  const tabs = [
    { id: "offer" as MarketplaceTab, label: "Offer" },
    { id: "service" as MarketplaceTab, label: "Service" },
  ];

  return (
    <div className="flex items-center space-x-2 mb-8">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;

        return (
          <motion.button
            key={tab.id}
            className={`relative px-6 py-3 rounded-full text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-[#2a849a] text-white"
                : "bg-[#F8EDE2] text-[#2a849a] hover:bg-gray-200"
            }`}
            onClick={() => onTabChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <span className="relative z-10">{tab.label}</span>
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-[#2a849a] rounded-full -z-10"
                layoutId="activeMarketplaceTab"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
