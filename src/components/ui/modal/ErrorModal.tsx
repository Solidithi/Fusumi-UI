"use client";

import { motion, AnimatePresence } from "framer-motion";
import { XCircle } from "lucide-react";
import { Button } from "../ButtonBussiness";

export interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  subtitle?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  showRetry?: boolean;
  showShakeEffect?: boolean;
}

export function ErrorModal({
  isOpen,
  onClose,
  title = "Error Occurred",
  message = "Something went wrong during processing",
  subtitle = "Please try again or contact support if the problem persists",
  primaryButtonText = "Close",
  secondaryButtonText = "Try Again",
  onPrimaryClick,
  onSecondaryClick,
  showRetry = true,
  showShakeEffect = true,
}: ErrorModalProps) {
  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else {
      onClose();
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30,
              duration: 0.4,
            }}
            className="relative bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 p-10 mx-4 max-w-md w-full"
            style={{
              boxShadow:
                "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.1)",
            }}
          >
            {/* Error Gradient Accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 rounded-t-3xl" />

            <div className="flex flex-col items-center space-y-8">
              {/* Error Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                  delay: 0.2,
                }}
                className="relative"
              >
                {/* Error Ring */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="w-24 h-24 bg-gradient-to-br from-red-100 to-red-50 rounded-full flex items-center justify-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                      delay: 0.3,
                    }}
                  >
                    <XCircle className="w-12 h-12 text-red-500" />
                  </motion.div>
                </motion.div>

                {/* Error Shake Effect */}
                {showShakeEffect && (
                  <motion.div
                    animate={{ x: [-2, 2, -2, 2, 0] }}
                    transition={{ delay: 0.8, duration: 0.5 }}
                    className="absolute inset-0"
                  />
                )}
              </motion.div>

              {/* Error Content */}
              <div className="text-center space-y-4">
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                  className="text-2xl font-bold text-gray-800"
                >
                  {title}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="text-sm font-medium text-red-600"
                >
                  {message}
                </motion.p>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="text-xs text-gray-500 max-w-xs"
                >
                  {subtitle}
                </motion.p>
              </div>

              {/* Error Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex space-x-3 w-full"
              >
                {showRetry && onSecondaryClick && (
                  <Button
                    onClick={handleSecondaryClick}
                    variant="outline"
                    className="flex-1 border-red-200 text-red-600 hover:bg-red-50 py-3 rounded-xl font-medium bg-transparent"
                  >
                    {secondaryButtonText}
                  </Button>
                )}
                <Button
                  onClick={handlePrimaryClick}
                  className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white py-3 rounded-xl font-medium"
                >
                  {primaryButtonText}
                </Button>
              </motion.div>
            </div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(239, 68, 68, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 transition-all duration-200"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
