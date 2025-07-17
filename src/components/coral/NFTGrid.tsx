"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { CoralCard } from "./NFTCard";
import { Offer } from "@/types/offer";

interface NFTGridProps {
  nfts: Offer[];
  displayedCount: number;
  totalCount: number;
  onLoadMore: () => void;
  loading?: boolean;
}

export function NFTGrid({
  nfts,
  displayedCount,
  totalCount,
  onLoadMore,
  loading = false,
}: NFTGridProps) {
  const loadingRef = useRef<HTMLDivElement>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1,
      },
    },
  };

  const hasMore = displayedCount < totalCount;

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loading) {
          onLoadMore();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [hasMore, loading, onLoadMore]);

  return (
    <div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {nfts.slice(0, displayedCount).map((nft, index) => (
          <CoralCard key={nft.id} nft={nft} index={index} />
        ))}
      </motion.div>

      {/* Loading indicator and intersection observer trigger */}
      {hasMore && (
        <div ref={loadingRef} className="flex justify-center mt-8 py-4">
          {loading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2a849a]"></div>
              <span>Loading more NFTs...</span>
            </div>
          ) : (
            <div className="h-4"></div>
          )}
        </div>
      )}
    </div>
  );
}
