"use client";

import { motion } from "framer-motion";
import type { OfferDatas } from "@/types/offer";
import { OfferCard } from "@/components/offer/OfferCard";

interface OffersGridProps {
  offers: OfferDatas[];
  onView?: (offer: OfferDatas) => void;
  onEdit?: (offer: OfferDatas) => void;
  onDelete?: (offerId: string) => void;
}

export function OffersGrid({
  offers,
  onView,
  onEdit,
  onDelete,
}: OffersGridProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  if (offers.length === 0) {
    return (
      <motion.div
        className="text-center py-16"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="text-gray-400 text-6xl mb-4">📄</div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No offers found
        </h3>
        <p className="text-gray-600">Create your first offer to get started</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {offers.map((offer, index) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          index={index}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </motion.div>
  );
}
