"use client"

import type React from "react"

import { getFavoriteStatus, getServiceSubscriptionData, toggleFavorite } from "@/lib/data"
import { AnimatePresence, motion } from "framer-motion"
import { Heart, Send, ShoppingCart, Star, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useState } from "react"
import { AnimatedButton } from "../Button"
import { Portal } from "../Portal"
import { Textarea } from "../TextArea"
import { SubscriptionFormModal } from "./SubscriptionFormModal"

interface Review {
  id: string
  user: string
  rating: number
  comment: string
  date: string
}

interface ProductDetailModalProps {
  isOpen: boolean
  onClose: () => void
  product: {
    id: string
    name: string
    price: number
    image: string
    business: string
    category: string
    type: "goods" | "service"
    sales: number
    rating: number
    reviews: number
    description: string
    isFavorite?: boolean
  } | null
  reviews: Review[]
  onFavoriteToggle: (productId: string) => void
  onSubmitReview: (rating: number, comment: string) => void
  onAddToCart: (productId: string) => void
}

export function ProductDetailModal({
  isOpen,
  onClose,
  product,
  reviews,
  onFavoriteToggle,
  onSubmitReview,
  onAddToCart,
}: ProductDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description")
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false)
  const [isFavorite, setIsFavorite] = useState(false)

  // Update favorite status when product changes or modal opens
  useEffect(() => {
    if (product) {
      setIsFavorite(getFavoriteStatus(product.id))
    }
  }, [product, isOpen])

  if (!product) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRating > 0 && newComment.trim()) {
      onSubmitReview(newRating, newComment)
      setNewRating(0)
      setNewComment("")
    }
  }

  const handleSubscribeClick = () => {
    setShowSubscriptionModal(true)
  }

  const handleFavoriteToggle = () => {
    if (!product) return
    
    const newFavoriteStatus = toggleFavorite(product.id)
    setIsFavorite(newFavoriteStatus)
    
    // Also call the parent callback if provided
    onFavoriteToggle(product.id)
    
    // Dispatch a custom event to notify other components about the favorite update
    window.dispatchEvent(new CustomEvent('favoriteUpdated', { detail: { productId: product.id } }))
  }

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  }

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 30 },
    },
    exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
  }

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Product Info Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Image */}
                  <div className="relative h-64 md:h-80 rounded-xl overflow-hidden">
                    <Image src={product.image || "/placeholder.svg"} alt={product.name} fill className="object-cover" />
                    <motion.button
                      onClick={handleFavoriteToggle}
                      className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 z-20 ${
                        isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:bg-red-500 hover:text-white"
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Heart className={`w-5 h-5 ${isFavorite ? "fill-current" : ""}`} />
                    </motion.button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600">{product.business}</p>
                    </div>

                    <div className="flex items-center gap-4">
                      <span className="text-3xl font-bold text-[#3587A3]">${product.price}</span>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{product.rating}</span>
                        <span className="text-gray-500">({product.reviews} reviews)</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-[#3587A3] text-white px-2 py-1 rounded-full text-sm font-medium">
                        {product.sales} sold
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-sm font-medium ${
                          product.type === "service" ? "bg-[#EDCCBB] text-[#3587A3]" : "bg-[#3587A3]/10 text-[#3587A3]"
                        }`}
                      >
                        {product.category}
                      </span>
                    </div>

                    <AnimatedButton
                      onClick={() => product.type === "service" ? handleSubscribeClick() : onAddToCart(product.id)}
                      className="w-full bg-[#3587A3] text-white hover:bg-[#2a6b85] py-3 text-lg rounded-lg flex items-center justify-center"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {product.type === "service" ? "Subscribe Now" : "Add to Cart"}
                    </AnimatedButton>
                  </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                  <div className="flex space-x-8">
                    <button
                      onClick={() => setActiveTab("description")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "description"
                          ? "border-[#3587A3] text-[#3587A3]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Description
                    </button>
                    <button
                      onClick={() => setActiveTab("reviews")}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === "reviews"
                          ? "border-[#3587A3] text-[#3587A3]"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      Reviews ({reviews.length})
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                <div className="min-h-[300px]">
                  {activeTab === "description" ? (
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed">{product.description}</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Write Review Form */}
                      <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4">
                        <h4 className="font-semibold text-gray-900 mb-4">Write a Review</h4>

                        {/* Rating Input */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <button
                                key={star}
                                type="button"
                                className="p-1"
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                                onClick={() => setNewRating(star)}
                              >
                                <Star
                                  className={`w-6 h-6 transition-colors ${
                                    star <= (hoveredStar || newRating)
                                      ? "text-yellow-400 fill-current"
                                      : "text-gray-300"
                                  }`}
                                />
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Comment Input */}
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
                          <Textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Share your experience with this product..."
                            className="min-h-[100px]"
                          />
                        </div>

                        <AnimatedButton
                          type="submit"
                          disabled={!newRating || !newComment.trim()}
                          className="bg-[#3587A3] text-white hover:bg-[#3587A3]/90"
                        >
                          <Send className="w-4 h-4 mr-2" />
                          Submit Review
                        </AnimatedButton>
                      </form>

                      {/* Existing Reviews */}
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900">All Reviews</h4>

                        {reviews.length === 0 ? (
                          <p className="text-gray-500 text-center py-8">
                            No reviews yet. Be the first to review this product!
                          </p>
                        ) : (
                          reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                              <div className="flex items-start gap-3">
                                <div className="w-10 h-10 rounded-full bg-[#3587A3]/10 flex items-center justify-center">
                                  <span className="text-sm font-medium text-[#3587A3]">
                                    {review.user.charAt(0).toUpperCase()}
                                  </span>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-gray-900">{review.user}</span>
                                    <div className="flex">
                                      {[...Array(5)].map((_, i) => (
                                        <Star
                                          key={i}
                                          className={`w-4 h-4 ${
                                            i < review.rating ? "text-yellow-400 fill-current" : "text-gray-300"
                                          }`}
                                        />
                                      ))}
                                    </div>
                                    <span className="text-sm text-gray-500">{review.date}</span>
                                  </div>
                                  <p className="text-gray-700">{review.comment}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Subscription Modal */}
      <SubscriptionFormModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        subscriptionData={getServiceSubscriptionData(product?.id || "1")}
      />
    </Portal>
  )
}
