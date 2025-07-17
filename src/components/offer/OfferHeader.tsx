"use client";

import { AnimatedButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUser } from "@/app/hooks/useUser";
import { motion } from "framer-motion";
import { Filter, Plus, Search } from "lucide-react";

interface OffersHeaderProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  statusFilter: string;
  onStatusFilterChange: (status: string) => void;
  totalCount: number;
  onCreateNew: () => void;
}

export function OffersHeader({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  totalCount,
  onCreateNew,
}: OffersHeaderProps) {
  const currentUser = useUser();

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
      className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Left side - Title and count */}
      <motion.div variants={itemVariants as any}>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">My Offers</h1>
        <p className="text-gray-600">
          {currentUser?.belongsToBusiness ? (
            <span className="flex flex-col">
              <span className="font-semibold text-[#2a849a]">
                Business Account
              </span>
              <span className="text-sm text-gray-500">
                Manage your business offers and proposals
              </span>
            </span>
          ) : (
            <span className="flex flex-col">
              <span className="font-semibold text-[#2a849a]">
                Personal Account
              </span>
              <span className="text-sm text-gray-500">
                Manage your personal offers and proposals
              </span>
            </span>
          )}
          {totalCount > 0 && (
            <motion.span
              className="ml-2 text-[#2a849a] font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ({totalCount} offers)
            </motion.span>
          )}
        </p>
      </motion.div>

      {/* Right side - Controls */}
      <motion.div
        className="flex flex-col sm:flex-row gap-4"
        variants={itemVariants as any}
      >
        {/* Search */}
        <div className="relative ">
          <Search className="absolute left-3 top-5 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            type="text"
            placeholder="Search offers..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-4 py-2 w-64 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#2a849a] focus:border-transparent"
          />
        </div>

        <div className="w-36 relative">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full py-2 text-center rounded-full bg-white text-black border border-gray-300 appearance-none pr-8 pl-8 focus:outline-none focus:ring-2 focus:ring-blue-500 items-center"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>
          {/* Filter icon inside select container, left side */}
          <span className="absolute left-2 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <Filter className="w-4 h-4" />
          </span>
          {/* Dropdown arrow (optional, for better UX) */}
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-gray-400">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>

        {/* Create New Button */}
        <AnimatedButton
          onClick={onCreateNew}
          className="bg-[#2a849a]  hover:bg-[#2a849a]/90 text-white px-6 py-2 rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300"
          //   asChild
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex items-center justify-center w-full h-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create New Offer
          </motion.button>
        </AnimatedButton>
      </motion.div>
    </motion.div>
  );
}
