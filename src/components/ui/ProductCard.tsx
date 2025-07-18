"use client";

import { easeOut, motion } from "framer-motion";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string;
    business: string;
    category: string;
    type: "goods" | "service";
    sales: number;
    rating: number;
    reviews: number;
    isFavorite?: boolean;
  };
  index: number;
  onFavoriteToggle?: (id: string) => void;
  onViewDetails?: (id: string) => void;
  shouldAnimate?: boolean;
}

export function ProductCard({
  product,
  index,
  onFavoriteToggle,
  onViewDetails,
  shouldAnimate = true,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        delay: shouldAnimate ? index * 0.05 : 0,
        ease: easeOut,
      },
    },
    static: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group min-w-[280px] flex-shrink-0 cursor-pointer"
      variants={cardVariants}
      initial={shouldAnimate ? "hidden" : "static"}
      animate={shouldAnimate ? "visible" : "static"}
      whileHover={{ y: -5 }}
      onClick={() => onViewDetails?.(product.id)}
    >
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.image || "https://via.placeholder.com/400x300.png?text=No+Image"}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-110"
        />

        {/* Favorite Button */}
        <motion.button
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-20 ${
            product.isFavorite
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
          }`}
          onClick={(e) => {
            e.stopPropagation();
            onFavoriteToggle?.(product.id);
          }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Heart
            className={`w-4 h-4 ${product.isFavorite ? "fill-current" : ""}`}
          />
        </motion.button>

        {/* Sales Badge */}
        <div className="absolute top-3 left-3 bg-[#3587A3] text-white px-2 py-1 rounded-full text-xs font-medium z-10">
          {product.sales} sold
        </div>

        {/* Quick Actions Overlay */}
        <div
          className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer z-0"
          onClick={() => onViewDetails?.(product.id)}
        />
      </div>

      {/* Content Section */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 flex-1">
            {product.name}
          </h3>
          <span className="text-[#3587A3] font-bold text-lg ml-2">
            ${product.price}
          </span>
        </div>

        <p className="text-sm text-gray-600 mb-3">{product.business}</p>

        {/* Rating and Reviews */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating)
                    ? "text-yellow-400 fill-current"
                    : "text-gray-300"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-gray-600">
            {product.rating} ({product.reviews})
          </span>
        </div>

        {/* Category Badge */}
        <div className="flex items-center justify-between">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              product.type === "service"
                ? "bg-[#EDCCBB] text-[#3587A3]"
                : "bg-[#3587A3]/10 text-[#3587A3]"
            }`}
          >
            {product.category}
          </span>
          <span className="text-xs text-gray-500 capitalize">
            {product.type}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
