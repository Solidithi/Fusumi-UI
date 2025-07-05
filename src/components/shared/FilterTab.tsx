"use client";

import { FilterType } from "@/types/dashboard";
import { motion } from "framer-motion";
import { FileText, CheckCircle, Clock } from "lucide-react";

interface FilterTabsProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
}

export function FilterTabs({ activeFilter, onFilterChange }: FilterTabsProps) {
  const tabs = [
    { id: "total" as FilterType, label: "Total", icon: FileText },
    { id: "paid" as FilterType, label: "Paid", icon: CheckCircle },
    { id: "unpaid" as FilterType, label: "Unpaid", icon: Clock },
  ];

  return (
    <div className="flex items-center space-x-2 mb-6">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeFilter === tab.id;

        return (
          <motion.button
            key={tab.id}
            className={`relative flex items-center space-x-2 px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              isActive
                ? "bg-[#2a849a] text-white"
                : "bg-[#F8EDE2] text-[#445E6D] hover:bg-gray-200"
            }`}
            onClick={() => onFilterChange(tab.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            layout
          >
            <Icon className="w-4 h-4" />
            <span>{tab.label}</span>
            {isActive && (
              <motion.div
                className="absolute inset-0 bg-[#2a849a] rounded-full -z-10"
                layoutId="activeTab"
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
