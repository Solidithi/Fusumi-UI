"use client";

import { motion } from "framer-motion";
import { Search } from "lucide-react";

interface SearchBarProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
}

export function SearchBar({ searchTerm, onSearchChange }: SearchBarProps) {
  return (
    <motion.div
      className="relative max-w-md text-black"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
      <input
        type="text"
        placeholder="Search"
        value={searchTerm}
        onChange={(e: any) => onSearchChange(e.target.value)}
        className="pl-10 pr-4 py-2 border border-gray-200 rounded-full focus:ring-2 focus:ring-[#2a849a] focus:border-transparent text-black"
      />
    </motion.div> 
  );
}
