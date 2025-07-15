"use client"

import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Store } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

interface Business {
  id: string
  name: string
  logo: string
  description: string
  rating: number
  totalReviews: number
  trending: any[]
  bestSellers: any[]
  goods: any[]
  services: any[]
}

interface TrendingBusinessSectionProps {
  businesses: Business[]
  onFavoriteToggle: (productId: string) => void
  onViewDetails: (productId: string) => void
}

export function TrendingBusinessSection({
  businesses,
  onFavoriteToggle,
  onViewDetails,
}: TrendingBusinessSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)

  const itemsPerPage = 4
  const totalPages = Math.ceil(businesses.length / itemsPerPage)

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentBusinesses = businesses.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  const displayedBusinesses = isExpanded ? businesses : currentBusinesses

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Store className="w-6 h-6 text-[#3587A3]" />
            <h2 className="text-2xl font-bold text-gray-900">Trending Businesses</h2>
          </div>
          <p className="text-gray-600">Most popular businesses this week</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm font-medium text-[#3587A3] hover:text-[#2a6d85] transition-colors"
          >
            {isExpanded ? "Show Less" : "Show All"}
          </button>
          
          {!isExpanded && totalPages > 1 && (
            <div className="flex gap-2">
              <button
                onClick={prevPage}
                className="p-2 rounded-full bg-[#3587A3]/10 hover:bg-[#3587A3]/20 transition-colors"
                disabled={currentIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 text-[#3587A3]" />
              </button>
              <button
                onClick={nextPage}
                className="p-2 rounded-full bg-[#3587A3]/10 hover:bg-[#3587A3]/20 transition-colors"
                disabled={currentIndex === totalPages - 1}
              >
                <ChevronRight className="w-4 h-4 text-[#3587A3]" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Business Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={isExpanded ? "expanded" : currentIndex}
          className={`grid ${
            isExpanded
              ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
          } gap-6`}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {displayedBusinesses.map((business) => (
            <motion.div
              key={business.id}
              className="bg-gray-50 rounded-xl p-4 hover:shadow-md transition-shadow"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={business.logo === "/placeholder.svg" 
                      ? `https://ui-avatars.com/api/?name=${encodeURIComponent(business.name)}&background=3587A3&color=fff&size=48` 
                      : business.logo}
                    alt={business.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{business.name}</h3>
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">⭐</span>
                    <span className="text-sm text-gray-600">
                      {business.rating} ({business.totalReviews})
                    </span>
                  </div>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {business.description}
              </p>
              
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>{business.trending.length + business.bestSellers.length + business.goods.length + business.services.length} Products</span>
                <span className="text-[#3587A3] font-medium">View Store</span>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Pagination Dots */}
      {!isExpanded && totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? "bg-[#3587A3]" : "bg-gray-300"
              }`}
            />
          ))}
        </div>
      )}
    </motion.div>
  )
}
