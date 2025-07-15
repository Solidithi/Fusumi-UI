"use client"

import { motion } from "framer-motion"
import { Filter, X } from "lucide-react"
import { useState } from "react"

interface ProductFiltersProps {
  onFilterChange: (filters: FilterState) => void
  activeFilters: FilterState
}

export interface FilterState {
  type: string[]
  category: string[]
  priceRange: [number, number]
  rating: number
}

const productTypes = ["goods", "service"]
const categories = ["Electronics", "Fashion", "Home & Garden", "Sports", "Books", "Health", "Business"]

export function ProductFilters({ onFilterChange, activeFilters }: ProductFiltersProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleTypeToggle = (type: string) => {
    const newTypes = activeFilters.type.includes(type)
      ? activeFilters.type.filter((t) => t !== type)
      : [...activeFilters.type, type]

    onFilterChange({ ...activeFilters, type: newTypes })
  }

  const handleCategoryToggle = (category: string) => {
    const newCategories = activeFilters.category.includes(category)
      ? activeFilters.category.filter((c) => c !== category)
      : [...activeFilters.category, category]

    onFilterChange({ ...activeFilters, category: newCategories })
  }

  const clearFilters = () => {
    onFilterChange({
      type: [],
      category: [],
      priceRange: [0, 1000],
      rating: 0,
    })
  }

  const activeFilterCount =
    activeFilters.type.length + activeFilters.category.length + (activeFilters.rating > 0 ? 1 : 0)

  return (
    <div className="relative">
      <motion.button
        className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-colors ${
          activeFilterCount > 0
            ? "bg-[#3587A3] text-white border-[#3587A3]"
            : "bg-white text-gray-700 border-gray-300 hover:border-[#3587A3]"
        }`}
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Filter className="w-4 h-4" />
        Filters
        {activeFilterCount > 0 && (
          <span className="bg-white text-[#3587A3] text-xs px-2 py-1 rounded-full font-medium">
            {activeFilterCount}
          </span>
        )}
      </motion.button>

      {isOpen && (
        <motion.div
          className="absolute top-full right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
        >
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <div className="flex gap-2">
                <button onClick={clearFilters} className="text-sm text-gray-500 hover:text-gray-700">
                  Clear all
                </button>
                <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Product Type Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Product Type</h4>
              <div className="space-y-2">
                {productTypes.map((type) => (
                  <label key={type} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.type.includes(type)}
                      onChange={() => handleTypeToggle(type)}
                      className="rounded border-gray-300 text-[#3587A3] focus:ring-[#3587A3]"
                    />
                    <span className="text-sm text-gray-700 capitalize">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3">Category</h4>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {categories.map((category) => (
                  <label key={category} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={activeFilters.category.includes(category)}
                      onChange={() => handleCategoryToggle(category)}
                      className="rounded border-gray-300 text-[#3587A3] focus:ring-[#3587A3]"
                    />
                    <span className="text-sm text-gray-700">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Rating Filter */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Minimum Rating</h4>
              <div className="space-y-2">
                {[4, 3, 2, 1].map((rating) => (
                  <label key={rating} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="rating"
                      checked={activeFilters.rating === rating}
                      onChange={() => onFilterChange({ ...activeFilters, rating })}
                      className="text-[#3587A3] focus:ring-[#3587A3]"
                    />
                    <span className="text-sm text-gray-700">{rating}+ stars</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  )
}
