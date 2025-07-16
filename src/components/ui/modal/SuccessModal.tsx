"use client";

import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useEffect } from "react";
import { Button } from "../ButtonBussiness";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  showParticles?: boolean;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export function SuccessModal({
  isOpen,
  onClose,
  title = "Success!",
  message = "Your request has been processed successfully",
  subtitle = "All operations completed without any issues",
  buttonText = "Continue",
  onButtonClick,
  showParticles = true,
  autoClose = false,
  autoCloseDelay = 3000,
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, autoCloseDelay, onClose]);

  const handleButtonClick = () => {
    if (onButtonClick) {
      onButtonClick();
    } else {
      onClose();
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
          {/* <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/50 to-black/60 backdrop-blur-md"
            onClick={onClose}
          /> */}

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
            {/* Success Gradient Accent */}
            {/* <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-green-400 to-green-500 rounded-t-3xl" /> */}

            <div className="flex flex-col items-center space-y-8">
              {/* Success Animation */}
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
                {/* Success Ring */}
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.1, duration: 0.5 }}
                  className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full flex items-center justify-center"
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
                    <CheckCircle className="w-12 h-12 text-green-500" />
                  </motion.div>
                </motion.div>

                {/* Success Particles */}
                {showParticles &&
                  [...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: Math.cos((i * Math.PI * 2) / 8) * 40,
                        y: Math.sin((i * Math.PI * 2) / 8) * 40,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.5 + i * 0.1,
                        ease: "easeOut",
                      }}
                      className="absolute top-1/2 left-1/2 w-2 h-2 bg-green-400 rounded-full"
                    />
                  ))}
              </motion.div>

              {/* Success Content */}
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
                  className="text-sm font-medium text-green-600"
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

              {/* Success Actions */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="flex space-x-3 w-full"
              >
                <Button
                  onClick={handleButtonClick}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-xl font-medium"
                >
                  {buttonText}
                </Button>
              </motion.div>

              {/* Auto-close indicator */}
              {autoClose && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="text-xs text-gray-400"
                >
                  Auto-closing in {Math.ceil(autoCloseDelay / 1000)} seconds
                </motion.div>
              )}
            </div>

            {/* Close Button */}
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              whileHover={{
                scale: 1.1,
                backgroundColor: "rgba(34, 197, 94, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:text-green-500 transition-all duration-200"
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
