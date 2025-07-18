"use client";

import { motion } from "framer-motion";
import { useMemo, useState } from "react";
// import { NFTHeader } from "./nft-header";
import coralsData from "@/../public/data/corals.json";
import { NFTGrid } from "@/components/coral/NFTGrid";
import { PageHeader } from "@/components/shared/PageHeader";
import { Coral } from "@/types/coral";

const ITEMS_PER_PAGE = 8; // Changed to 8 items per load

export function MyNFT() {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedCount, setDisplayedCount] = useState(ITEMS_PER_PAGE);
  const [loading, setLoading] = useState(false);

  const filteredNFTs = useMemo(() => {
    const corals = coralsData as Coral[];
    return corals.filter(
      (coral: Coral) =>
        coral.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coral.contactInfo?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        coral.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleLoadMore = () => {
    if (loading) return;

    setLoading(true);
    // Simulate loading delay - reduced from 800ms to 300ms
    setTimeout(() => {
      setDisplayedCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, filteredNFTs.length)
      );
      setLoading(false);
    }, 100);
  };

  // Reset displayed count when search changes
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setDisplayedCount(ITEMS_PER_PAGE);
  };

  return (
    <div className="min-h-screen bg-white flex">
      <div className="w-full">
        <motion.div
          className="min-h-screen bg-gray-50 py-8 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto">
            {/* <NFTHeader
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          totalCount={filteredNFTs.length}
        /> */}
            <PageHeader
              title="My NFTs "
              subtitle="Showcase your unique digital story"
            />

            {filteredNFTs.length > 0 ? (
              <NFTGrid
                nfts={filteredNFTs}
                displayedCount={displayedCount}
                totalCount={filteredNFTs.length}
                onLoadMore={handleLoadMore}
                loading={loading}
              />
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No NFTs found
                </h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
