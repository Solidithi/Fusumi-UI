"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, DollarSign, CheckCircle } from "lucide-react";

import Image from "next/image";
import type { ServiceDetailData } from "@/types/modal";
import { Portal } from "../Portal";
import { AnimatedButton } from "../Button";

interface ServiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  serviceData: ServiceDetailData;
}

export function ServiceDetailModal({
  isOpen,
  onClose,
  onClick,
  serviceData,
}: ServiceDetailModalProps) {
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      scale: 0.8,
      y: 50,
    },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
      },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2,
      },
    },
  };

  const contentVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

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
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[85vh] overflow-y-auto relative"
              variants={modalVariants as any}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <motion.h2
                  className="text-2xl font-bold text-gray-900"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  Service Detail
                </motion.h2>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Content */}
              <motion.div
                className="p-6 space-y-6"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Hero Image */}
                <motion.div
                  className="relative w-full h-48 md:h-64 rounded-xl overflow-hidden"
                  variants={itemVariants as any}
                >
                  <Image
                    src={
                      serviceData.image ||
                      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lYmmjSZAbS3GTaHKdhjr2G5OhMBRrf.png" ||
                      "/placeholder.svg" ||
                      "/placeholder.svg"
                    }
                    alt="Service Hero"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                </motion.div>

                {/* Service Info */}
                <motion.div
                  className="space-y-4"
                  variants={itemVariants as any}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">
                      {serviceData.serviceName}
                    </h3>
                    <div className="flex items-center space-x-2 bg-[#2a849a] text-white px-4 py-2 rounded-full">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">
                        ${serviceData.price}/month
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-600 leading-relaxed">
                    {serviceData.description}
                  </p>
                </motion.div>

                {/* Date Information */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={itemVariants as any}
                >
                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-[#2a849a]" />
                      <h4 className="font-semibold text-gray-900">
                        Start Date
                      </h4>
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                      {serviceData.startDate}
                    </p>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Calendar className="w-5 h-5 text-[#2a849a]" />
                      <h4 className="font-semibold text-gray-900">End Date</h4>
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                      {serviceData.endDate}
                    </p>
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  className="space-y-4"
                  variants={itemVariants as any}
                >
                  <h4 className="text-lg font-semibold text-gray-900">
                    What Included:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {serviceData.features.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center space-x-3"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Business Info */}
                <motion.div
                  className="bg-gray-50 rounded-xl p-4"
                  variants={itemVariants as any}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Provided by
                  </h4>
                  <p className="text-lg font-medium text-[#2a849a]">
                    {serviceData.businessName}
                  </p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  className="flex justify-end space-x-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <AnimatedButton
                    variant="outline"
                    onClick={onClose}
                    className="px-6 bg-gray-400 text-white rounded-xl p-3 "
                  >
                    Close
                  </AnimatedButton>
                  <AnimatedButton
                  onClick={onClick}
                  className="bg-[#2a849a] rounded-xl p-3 hover:bg-[#2a849a]/90 text-white px-6">
                    Subscribe Now
                  </AnimatedButton>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
