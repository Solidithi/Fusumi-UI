"use client";

import { motion } from "framer-motion";
import type { NFTData } from "@/types/nft";
import { NFTCard } from "./NFTCard";
import { ShowMoreButton } from "../ui/ShowMoreButton";

interface NFTGridProps {
  nfts: NFTData[];
  displayedCount: number;
  totalCount: number;
  onShowMore: () => void;
  loading?: boolean;
}

export function NFTGrid({
  nfts,
  displayedCount,
  totalCount,
  onShowMore,
  loading = false,
}: NFTGridProps) {
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

  return (
    <div>
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {nfts.slice(0, displayedCount).map((nft, index) => (
          <NFTCard key={nft.id} nft={nft} index={index} />
        ))}
      </motion.div>

      {hasMore && <ShowMoreButton onClick={onShowMore} loading={loading} />}
    </div>
  );
}
