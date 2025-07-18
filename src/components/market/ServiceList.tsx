"use client";

import { motion } from "framer-motion";
import { ServiceData } from "@/types/market";
import { ShowMoreButton } from "../ui/ShowMoreButton";
import { ServiceRow } from "./ServiceRow";
import { useEffect, useRef } from "react";

interface ServiceListProps {
  services: any[];
  displayedCount: number;
  totalCount: number;
  onLoadMore: () => void;
  loading?: boolean;
}

export function ServiceList({
  services,
  displayedCount,
  totalCount,
  onLoadMore,
  loading = false,
}: ServiceListProps) {
  const loadingRef = useRef<HTMLDivElement>(null);
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

      {hasMore && (
        <div ref={loadingRef} className="flex justify-center mt-8 py-4">
          {loading ? (
            <div className="flex items-center space-x-2 text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2a849a]"></div>
              <span>Loading more services...</span>
            </div>
          ) : (
            <div className="h-4"></div>
          )}
        </div>
      )}
    </div>
  );
}
