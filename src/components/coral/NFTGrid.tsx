"use client";

import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { NFTCard } from "./NFTCard";
import { Coral } from "@/types/coral";

interface NFTGridProps {
  nfts: Coral[];
  displayedCount: number;
  totalCount: number;
  onLoadMore: () => void;
  loading?: boolean;
  isPurchaseMode?: boolean; // New prop for purchase mode
  onPurchaseComplete?: (purchaseData: any) => void; // Callback for purchase completion
  isSellMode?: boolean; // New prop for sell mode
  onSaleComplete?: (saleData: any) => void; // Callback for sale completion
  isPreviewMode?: boolean; // New prop for preview mode
}

export function NFTGrid({
  nfts,
  displayedCount,
  totalCount,
  onLoadMore,
  loading = false,
  isPurchaseMode = false,
  onPurchaseComplete,
  isSellMode = false,
  onSaleComplete,
  isPreviewMode = false,
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
          <NFTCard
            key={nft.id}
            nft={nft}
            index={index}
            isPurchaseMode={isPurchaseMode}
            onPurchaseComplete={onPurchaseComplete}
            isSellMode={isSellMode}
            onSaleComplete={onSaleComplete}
            isPreviewMode={isPreviewMode}
          />
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
