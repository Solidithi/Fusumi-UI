"use client"

import { getProductsWithFavorites, initializeFavorites, toggleFavorite } from "@/lib/data"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useRef, useState, memo, useCallback, useMemo } from "react"
import { AnimatedButton } from "../ui/Button"
import { ProductCard } from "../ui/ProductCard"

interface BusinessSectionProps {
  business: {
    id: string
    name: string
    logo: string
    description: string
    trending: any[]
    bestSellers: any[]
    goods: any[]
    services: any[]
  }
  onFavoriteToggle?: (productId: string) => void
  onViewDetails?: (productId: string) => void
  shouldAnimate?: boolean
}

// Memoized ProductRow component to prevent unnecessary re-renders
const ProductRow = memo(({ 
  title, 
  products, 
  sectionKey, 
  scrollRefs, 
  onFavoriteToggle, 
  onViewDetails,
  handleScroll,
  shouldAnimate
}: {
  title: string
  products: any[]
  sectionKey: string
  scrollRefs: any
  onFavoriteToggle?: (id: string) => void
  onViewDetails?: (id: string) => void
  handleScroll: (direction: "left" | "right", section: string) => void
  shouldAnimate?: boolean
}) => {
  const productsWithFavorites = getProductsWithFavorites(products);
  
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-gray-900">{title}</h4>
        <div className="flex gap-2">
          <button
            onClick={() => handleScroll("left", sectionKey)}
            className="p-2 rounded-full bg-[#3587A3]/10 hover:bg-[#3587A3]/20 transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-[#3587A3]" />
          </button>
          <button
            onClick={() => handleScroll("right", sectionKey)}
            className="p-2 rounded-full bg-[#3587A3]/10 hover:bg-[#3587A3]/20 transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-[#3587A3]" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRefs[sectionKey]}
        className="flex gap-4 overflow-x-auto scrollbar-hide pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {productsWithFavorites.map((product, index) => (
          <ProductCard
            key={product.id} // Remove refreshKey to prevent unnecessary re-renders
            product={product}
            index={index}
            onFavoriteToggle={onFavoriteToggle}
            onViewDetails={onViewDetails}
            shouldAnimate={shouldAnimate}
          />
        ))}
      </div>
    </div>
  );
});

ProductRow.displayName = "ProductRow";

export const BusinessSection = memo(function BusinessSection({ 
  business, 
  onFavoriteToggle, 
  onViewDetails,
  shouldAnimate = true 
}: BusinessSectionProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  
  // Initialize favorites from localStorage on component mount
  useEffect(() => {
    initializeFavorites()
  }, [])
  
  const trendingRef = useRef<HTMLDivElement>(null)
  const bestSellersRef = useRef<HTMLDivElement>(null)
  const goodsRef = useRef<HTMLDivElement>(null)
  const servicesRef = useRef<HTMLDivElement>(null)
  
  const scrollRefs = useMemo(() => ({
    trending: trendingRef,
    bestSellers: bestSellersRef,
    goods: goodsRef,
    services: servicesRef,
  }), [])

  // Handle favorite toggle with optimized re-rendering
  const handleFavoriteToggle = useCallback((productId: string) => {
    // Update the favorites in the data layer
    toggleFavorite(productId)
    
    // Dispatch event to notify other components
    window.dispatchEvent(new CustomEvent('favoriteUpdated', { detail: { productId } }))
    
    // Call the parent callback if provided
    onFavoriteToggle?.(productId)
  }, [onFavoriteToggle])

  const handleScroll = useCallback((direction: "left" | "right", section: string) => {
    const container = scrollRefs[section as keyof typeof scrollRefs].current
    if (container) {
      const scrollAmount = 300 // Adjust based on card width
      const newScrollLeft =
        direction === "left" ? container.scrollLeft - scrollAmount : container.scrollLeft + scrollAmount

      container.scrollTo({
        left: newScrollLeft,
        behavior: "smooth",
      })
    }
  }, [scrollRefs])

  const motionProps = shouldAnimate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  } : {};

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      {...motionProps}
    >
      {/* Business Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="w-16 h-16 rounded-full bg-[#3587A3]/10 flex items-center justify-center">
          <span className="text-2xl font-bold text-[#3587A3]">{business.name.charAt(0)}</span>
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">{business.name}</h3>
          <p className="text-gray-600">{business.description}</p>
        </div>
      </div>

      {/* Always show trending products */}
      <ProductRow 
        title="Trending Products" 
        products={business.trending} 
        sectionKey="trending"
        scrollRefs={scrollRefs}
        onFavoriteToggle={handleFavoriteToggle}
        onViewDetails={onViewDetails}
        handleScroll={handleScroll}
        shouldAnimate={shouldAnimate}
      />

      {/* Expandable sections with smooth animation */}
      <AnimatePresence mode="wait">
        {isExpanded && (
          <motion.div
            key="expanded-content"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ 
              duration: 0.4,
              ease: "easeInOut",
              opacity: { duration: 0.3 },
              height: { duration: 0.4 }
            }}
            style={{ overflow: "hidden" }}
          >
            <ProductRow 
              title="Best Sellers" 
              products={business.bestSellers} 
              sectionKey="bestSellers"
              scrollRefs={scrollRefs}
              onFavoriteToggle={handleFavoriteToggle}
              onViewDetails={onViewDetails}
              handleScroll={handleScroll}
              shouldAnimate={shouldAnimate}
            />
            <ProductRow 
              title="Goods" 
              products={business.goods} 
              sectionKey="goods"
              scrollRefs={scrollRefs}
              onFavoriteToggle={handleFavoriteToggle}
              onViewDetails={onViewDetails}
              handleScroll={handleScroll}
              shouldAnimate={shouldAnimate}
            />
            <ProductRow 
              title="Services" 
              products={business.services} 
              sectionKey="services"
              scrollRefs={scrollRefs}
              onFavoriteToggle={handleFavoriteToggle}
              onViewDetails={onViewDetails}
              handleScroll={handleScroll}
              shouldAnimate={shouldAnimate}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button with smooth animation */}
      <motion.div 
        className="flex justify-center mt-6"
        initial={false}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <AnimatedButton
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 px-6 py-2 bg-[#3587A3] text-white hover:bg-[#2a6b85] border-none rounded-lg transition-all duration-300"
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <ChevronDown className="w-4 h-4" />
          </motion.div>
          <motion.span
            key={isExpanded ? "less" : "more"}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? "Show Less" : "Show More Products"}
          </motion.span>
        </AnimatedButton>
      </motion.div>
    </motion.div>
  )
})
