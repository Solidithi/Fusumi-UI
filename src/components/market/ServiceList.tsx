"use client";

import { motion } from "framer-motion";
import { ServiceData } from "@/types/market";
import { ShowMoreButton } from "../ui/ShowMoreButton";
import { ServiceRow } from "./ServiceRow";

interface ServiceListProps {
  services: ServiceData[];
  displayedCount: number;
  totalCount: number;
  onShowMore: () => void;
  loading?: boolean;
}

export function ServiceList({
  services,
  displayedCount,
  totalCount,
  onShowMore,
  loading = false,
}: ServiceListProps) {
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

  const hasMore = displayedCount < totalCount;

  return (
    <div>
      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {services.slice(0, displayedCount).map((service, index) => (
          <ServiceRow key={service.id} service={service} index={index} />
        ))}
      </motion.div>

      {hasMore && <ShowMoreButton onClick={onShowMore} loading={loading} />}
    </div>
  );
}
