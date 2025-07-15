"use client"

import { ProductCard } from "@/components/ui/ProductCard"
import { getProductsWithFavorites, toggleFavorite } from "@/lib/data"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

interface Product {
  id: string
  name: string
  price: number
  originalPrice?: number
  rating: number
  reviews: number
  sales: number
  image: string
  business: string
  category: string
  type: "goods" | "service"
  description?: string
  isFavorite?: boolean
}

interface TrendingProductsSectionProps {
  products: Product[]
  onFavoriteToggle: (productId: string) => void
  onViewDetails: (productId: string) => void
}

export function TrendingProductsSection({
  products,
  onFavoriteToggle,
  onViewDetails,
}: TrendingProductsSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isExpanded, setIsExpanded] = useState(false)
  const [productsWithFavorites, setProductsWithFavorites] = useState<Product[]>([])

  // Apply favorite status from localStorage whenever products change
  useEffect(() => {
    setProductsWithFavorites(getProductsWithFavorites(products))
  }, [products])

  // Listen for localStorage changes from other components (like modals)
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'favorites' || e.key === null) {
        setProductsWithFavorites(getProductsWithFavorites(products))
      }
    }

    const handleFocus = () => {
      setProductsWithFavorites(getProductsWithFavorites(products))
    }
    
    // Listen for both storage events and custom events
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('focus', handleFocus)
    
    // Also listen for a custom event that we can dispatch when favorites change
    const handleFavoriteUpdate = (event: any) => {
      // Force immediate refresh from localStorage
      const updatedProducts = getProductsWithFavorites(products)
      setProductsWithFavorites(updatedProducts)
    }
    
    window.addEventListener('favoriteUpdated', handleFavoriteUpdate)
    
    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('favoriteUpdated', handleFavoriteUpdate)
    }
  }, [products])

  const handleFavoriteToggle = (productId: string) => {
    // Directly toggle favorite in localStorage
    const newFavoriteStatus = toggleFavorite(productId)
    
    // Immediately update the local products state with the new status
    setProductsWithFavorites(prevProducts => 
      prevProducts.map(product => 
        product.id === productId 
          ? { ...product, isFavorite: newFavoriteStatus }
          : product
      )
    )
    
    // Dispatch a custom event to notify other components (but don't call parent)
    window.dispatchEvent(new CustomEvent('favoriteUpdated', { detail: { productId } }))
  }

  const itemsPerPage = 8 // 2 rows x 4 columns
  const totalPages = Math.ceil(productsWithFavorites.length / itemsPerPage)

  const nextPage = () => {
    setCurrentIndex((prev) => (prev + 1) % totalPages)
  }

  const prevPage = () => {
    setCurrentIndex((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const currentProducts = productsWithFavorites.slice(
    currentIndex * itemsPerPage,
    (currentIndex + 1) * itemsPerPage
  )

  const displayedProducts = isExpanded ? productsWithFavorites : currentProducts

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-lg p-6 mb-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">⚡ Trending Products</h2>
          <p className="text-gray-600">Hot picks from across all categories</p>
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

      {/* Products Grid */}
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
          {displayedProducts.map((product: Product, index: number) => (
            <motion.div
              key={product.id}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <ProductCard
                product={product}
                index={index}
                onFavoriteToggle={handleFavoriteToggle}
                onViewDetails={onViewDetails}
              />
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
