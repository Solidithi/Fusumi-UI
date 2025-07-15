"use client"

import type React from "react"

import { AnimatePresence, motion } from "framer-motion"
import { Send, Star, X } from "lucide-react"
import { useState } from "react"
import { AnimatedButton } from "../Button"
import { Portal } from "../Portal"
import { Textarea } from "../TextArea"

interface Review {
  id: string
  user: string
  rating: number
  comment: string
  date: string
  avatar?: string
}

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  reviews: Review[]
  onSubmitReview: (rating: number, comment: string) => void
}

export function ReviewModal({ isOpen, onClose, productName, reviews, onSubmitReview }: ReviewModalProps) {
  const [newRating, setNewRating] = useState(0)
  const [newComment, setNewComment] = useState("")
  const [hoveredStar, setHoveredStar] = useState(0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (newRating > 0 && newComment.trim()) {
      onSubmitReview(newRating, newComment)
      setNewRating(0)
      setNewComment("")
    }
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
              className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto"
              variants={modalVariants}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Reviews for {productName}</h2>
                <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6 space-y-6">
                {/* Write Review Form */}
                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Write a Review</h3>

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
                              star <= (hoveredStar || newRating) ? "text-yellow-400 fill-current" : "text-gray-300"
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
                  <h3 className="font-semibold text-gray-900">All Reviews ({reviews.length})</h3>

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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  )
}
