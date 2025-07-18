"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

interface PurchaseSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  purchaseDetails: {
    nftId: string;
    percentage: number;
    totalPrice: number;
    newNftId: string;
  };
}

export function PurchaseSuccessModal({
  isOpen,
  onClose,
  purchaseDetails,
}: PurchaseSuccessModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 50 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Success animation */}
            <div className="text-center">
              <motion.div
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
              >
                {/* Ripple effect */}
                <motion.div
                  className="absolute inset-0 bg-green-200 rounded-full"
                  initial={{ scale: 0, opacity: 0.8 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ delay: 0.4, duration: 1 }}
                />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.4, type: "spring", stiffness: 400 }}
                >
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </motion.div>
              </motion.div>

              <motion.h2
                className="text-2xl font-bold text-gray-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                Purchase Successful!
              </motion.h2>

              <motion.p
                className="text-gray-600 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                Your coral branch NFT has been successfully minted and added to
                your collection.
              </motion.p>

              {/* Purchase details */}
              <motion.div
                className="bg-gray-50 rounded-lg p-4 space-y-3 mb-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex justify-between">
                  <span className="text-gray-600">Share Purchased:</span>
                  <span className="font-semibold">
                    {purchaseDetails.percentage}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Price:</span>
                  <span className="font-semibold text-green-600">
                    ${purchaseDetails.totalPrice.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">New NFT ID:</span>
                  <span className="font-semibold text-blue-600 text-sm">
                    {purchaseDetails.newNftId}
                  </span>
                </div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex gap-3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    // Navigate to user's NFT collection
                    console.log("Navigate to collection");
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  View NFT
                </button>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
