"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Portal } from "../Portal";
import { Input } from "../Input";
import { Textarea } from "../TextArea";
import { AnimatedButton } from "../Button";
import { InvoiceDetailData } from "@/types/modal";

interface InvoiceDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  //   onClick: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  invoiceData: InvoiceDetailData;
}

export function InvoiceDetailModal({
  isOpen,
  onClose,
  onClick,
  invoiceData,
}: InvoiceDetailModalProps) {
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
            className="fixed inset-0 text-black bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4"
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
                  Invoice Detail
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
                {/* Top Section */}
                <motion.div
                  className="bg-gray-100 rounded-xl p-6 space-y-4"
                  variants={itemVariants as any}
                >
                  {/* Debtor Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Debtor Address
                    </label>
                    <Input
                      value={invoiceData.debtorAddress}
                      readOnly
                      className="bg-white"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <Textarea
                      value={invoiceData.description}
                      readOnly
                      className="bg-white min-h-[120px] resize-none"
                    />
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date
                      </label>
                      <Input
                        value={invoiceData.startDate}
                        readOnly
                        className="bg-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date
                      </label>
                      <Input
                        value={invoiceData.endDate}
                        readOnly
                        className="bg-white"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Products Section */}
                <motion.div
                  className="bg-gray-100 rounded-xl p-6 space-y-4"
                  variants={itemVariants as any}
                >
                  {invoiceData.products.map((product: any, index: any) => (
                    <motion.div
                      key={product.id}
                      className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Product name/ Service
                        </label>
                        <Input
                          value={product.name}
                          readOnly
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Price
                        </label>
                        <Input
                          value={`$${product.price}`}
                          readOnly
                          className="bg-white"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Quantity
                        </label>
                        <Input
                          value={product.quantity}
                          readOnly
                          className="bg-white"
                        />
                      </div>
                    </motion.div>
                  ))}

                  {/* Total Line */}
                  <motion.div
                    className="border-t-2 border-[#2a849a] pt-4 mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                  >
                    <div className="flex justify-end">
                      <div className="grid grid-cols-2 gap-4 w-full md:w-2/3">
                        <div>
                          <label className="block text-lg font-semibold text-gray-900 mb-2">
                            Total:
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Input
                            value={`$${invoiceData.total.price}`}
                            readOnly
                            className="bg-white font-semibold"
                          />
                          <Input
                            value={invoiceData.total.quantity}
                            readOnly
                            className="bg-white font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
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
                    className="px-6 bg-gray-400 text-white rounded-xl"
                  >
                    Close
                  </AnimatedButton>
                  <AnimatedButton
                    onClick={onClick}
                    className="bg-[#2a849a] hover:bg-[#2a849a]/90 rounded-xl p-3 text-white px-6"
                  >
                    Buy
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
