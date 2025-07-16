"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  title?: string;
  message?: string;
  showCloseButton?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
  color?: string;
  showProgressBar?: boolean;
  backdrop?: boolean;
}

export default function LoadingModal({
  isOpen = true,
  onClose,
  title = "Loading...",
  message = "Please wait while we process your request",
  showCloseButton = true,
  autoClose = false,
  autoCloseDelay = 3000,
  color = "#2A849A",
  showProgressBar = true,
  backdrop = true,
}: LoadingModalProps) {
  React.useEffect(() => {
    if (autoClose && autoCloseDelay && isOpen) {
      const timer = setTimeout(() => {
        onClose?.();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [autoClose, autoCloseDelay, isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          {/* Backdrop */}
          {backdrop && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => onClose?.()}
            />
          )}

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25,
              duration: 0.3,
            }}
            className="relative bg-white rounded-2xl shadow-2xl p-8 mx-4 max-w-sm w-full"
          >
            {/* Loading Content */}
            <div className="flex flex-col items-center space-y-6">
              {/* Animated Loading Spinner */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 1,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="relative"
              >
                <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                <div 
                  className="absolute top-0 left-0 w-16 h-16 border-4 rounded-full border-t-transparent"
                  style={{ borderColor: color, borderTopColor: 'transparent' }}
                ></div>
              </motion.div>

              {/* Pulsing Dots */}
              <div className="flex space-x-2">
                {[0, 1, 2].map((index) => (
                  <motion.div
                    key={index}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.2,
                    }}
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              {/* Loading Text */}
              <div className="text-center space-y-2">
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold text-gray-800"
                >
                  {title}
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-500"
                >
                  {message}
                </motion.p>
              </div>

              {/* Progress Bar */}
              {showProgressBar && (
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: autoCloseDelay / 1000, ease: "easeInOut" }}
                    className="h-full rounded-full"
                    style={{ 
                      background: `linear-gradient(to right, ${color}, ${color}CC)` 
                    }}
                  />
                </div>
              )}
            </div>

            {/* Close Button */}
            {showCloseButton && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                onClick={() => onClose?.()}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg
                  className="w-6 h-6"
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
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
