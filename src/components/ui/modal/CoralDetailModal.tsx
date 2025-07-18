"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Portal } from "../Portal";
import { useState } from "react";
import { InvoiceDetail } from "@/components/shared/InvoiceDetail";
import { Coral } from "@/types/coral";
import { getInvoiceDetail } from "@/lib/data";
import { PurchaseCoralBranch } from "@/components/coral/PurchaseCoralBranch";
import { SellCoralBranch } from "@/components/coral/SellCoralBranch";

interface CoralDetailModal {
  coral: Coral;
  isOpen: boolean;
  onClose: () => void;
  //   onClick: () => void;
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export function CoralDetailModal({
  coral: nft,
  isOpen,
  onClose,
  onClick,
}: CoralDetailModal) {
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

  // Tab state
  const [activeTab, setActiveTab] = useState<
    "details" | "splits" | "purchase" | "sell"
  >("details");

  // Mock NFT tree data for demonstration (replace with real data as needed)
  const nftTree = {
    root: {
      id: "NFT-001", // fallback value
      owner: "Business", // fallback value
      share: 1.0,
    },
    splits: [
      // Example children (splits)
      { id: "NFT-002", owner: "InvestorA", share: 0.3 },
      { id: "NFT-003", owner: "InvestorB", share: 0.2 },
      { id: "NFT-004", owner: "Business", share: 0.5 },
    ],
  };

  // For demo, assume current user is 'Business' (replace with wallet address or user context in real app)
  const currentUser = "Business";

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
              className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[85vh] overflow-y-auto relative"
              variants={modalVariants as any}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header with Tabs */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex gap-4">
                  <button
                    className={`text-lg font-bold px-2 pb-1 border-b-2 transition-colors duration-200 ${
                      activeTab === "details"
                        ? "border-[#2a849a] text-[#2a849a]"
                        : "border-transparent text-gray-500"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    Invoice Details
                  </button>
                  <button
                    className={`text-lg font-bold px-2 pb-1 border-b-2 transition-colors duration-200 ${
                      activeTab === "purchase"
                        ? "border-[#2a849a] text-[#2a849a]"
                        : "border-transparent text-gray-500"
                    }`}
                    onClick={() => setActiveTab("purchase")}
                  >
                    Purchase
                  </button>
                  <button
                    className={`text-lg font-bold px-2 pb-1 border-b-2 transition-colors duration-200 ${
                      activeTab === "sell"
                        ? "border-[#2a849a] text-[#2a849a]"
                        : "border-transparent text-gray-500"
                    }`}
                    onClick={() => setActiveTab("sell")}
                  >
                    Sell
                  </button>
                  <button
                    className={`text-lg font-bold px-2 pb-1 border-b-2 transition-colors duration-200 ${
                      activeTab === "splits"
                        ? "border-[#2a849a] text-[#2a849a]"
                        : "border-transparent text-gray-500"
                    }`}
                    onClick={() => setActiveTab("splits")}
                  >
                    View Branches
                  </button>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-500" />
                </motion.button>
              </div>

              {/* Tab Content */}
              <motion.div
                className="p-6 space-y-6"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {activeTab === "details" && (
                  <InvoiceDetail
                    onClose={onClose}
                    invoiceData={getInvoiceDetail(nft.id)}
                  />
                )}
                {activeTab === "splits" && (
                  <motion.div
                    className="bg-gray-100 rounded-xl p-6 space-y-6"
                    variants={itemVariants as any}
                  >
                    <div className="mb-4">
                      <div className="text-lg font-bold text-[#2a849a] mb-2">
                        NFT Splitting Hierarchy
                      </div>
                      <div className="text-sm text-gray-700 mb-4">
                        {/* This NFT tree is always 1-depth: the root NFT and its
                        direct splits. Each split represents a share of the
                        original invoice's value. */}
                        Visualize the original invoice NFT as the base of a
                        coral. Each split grows a new "coral branch"—a smaller
                        NFT representing a share of the original value, creating
                        a beautiful structure of ownership.
                      </div>
                    </div>
                    {/* NFT Tree Visualization */}
                    <div className="flex flex-col items-center gap-4">
                      {/* Root NFT */}
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-[#2a849a]/90 text-white px-6 py-2 font-bold text-base shadow">
                          Root NFT
                        </div>
                        <div className="text-xs text-gray-700 mt-1">
                          ID: {nftTree.root.id}
                        </div>
                        <div className="text-xs text-gray-700">
                          Owner: {nftTree.root.owner}
                        </div>
                        <div className="text-xs text-gray-700">
                          Share: {(nftTree.root.share * 100).toFixed(1)}%
                        </div>
                      </div>
                      {/* Down arrow */}
                      <div className="w-1 h-6 bg-[#2a849a]/40 rounded-full" />
                      {/* Splits */}
                      <div className="flex flex-row flex-wrap gap-4 justify-center">
                        {nftTree.splits.map((split) => (
                          <div
                            key={split.id}
                            className="flex flex-col items-center bg-white rounded-xl px-4 py-2 shadow border border-[#2a849a]/20 min-w-[120px] relative"
                          >
                            <div className="font-semibold text-[#2a849a] flex items-center gap-2">
                              Split NFT
                              {split.owner === currentUser && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 text-white text-xs font-semibold shadow-md border border-white absolute -top-4 left-1/2 -translate-x-1/2 animate-fade-in">
                                  <svg
                                    className="w-3 h-3 text-white"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  Yours
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-700 mt-1">
                              ID: {split.id}
                            </div>
                            <div className="text-xs text-gray-700">
                              Owner: {split.owner}
                            </div>
                            <div className="text-xs text-gray-700">
                              Share: {(split.share * 100).toFixed(1)}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
                {activeTab === "purchase" && (
                  <motion.div variants={itemVariants as any}>
                    <PurchaseCoralBranch rootNft={nft} />
                  </motion.div>
                )}
                {activeTab === "sell" && (
                  <motion.div variants={itemVariants as any}>
                    <SellCoralBranch rootNft={nft} />
                  </motion.div>
                )}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </Portal>
  );
}
