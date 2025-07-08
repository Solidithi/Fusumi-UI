"use client";

import { AnimatedButton } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
// import { Input } from "@/components/ui/Input";
import { motion } from "framer-motion";
import { Plus, Search, Filter } from "lucide-react";

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
          Manage your business offers and proposals
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

        {/* Status Filter */}
        {/* <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-40">
            <Filter className="w-4 h-4 mr-2" />
            <SelectValue placeholder="All Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="expired">Expired</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select> */}
        <div className="w-36">
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="w-full py-2  text-center  rounded-full bg-white text-black border border-gray-300 appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        {/* Icon bên phải giống như `Filter` */}
        <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-black">
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
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L15 13.414V19a1 1 0 01-1.447.894l-4-2A1 1 0 019 17v-3.586L3.293 6.707A1 1 0 013 6V4z"
            />
          </svg>
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
