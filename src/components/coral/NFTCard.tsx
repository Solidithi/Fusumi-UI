"use client";

import type React from "react";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  AnimatePresence,
} from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import {
  Clock,
  Coins,
  Star,
  Zap,
  ShoppingCart,
  Percent,
  Calculator,
  CreditCard,
  Info,
  CheckCircle,
  AlertCircle,
  X,
  DollarSign,
} from "lucide-react";
import { CoralDetailModal } from "../ui/modal/CoralDetailModal";
import type { Coral } from "@/types/coral";
import { getBusinessById } from "@/utils/businessUtils";
import { BusinessId } from "@/types/business";
import { getUserByAddress } from "@/utils/userUtils";
import { formatAddress } from "@/utils/address";
import { formatCurrency } from "@/utils/invoiceUtils";

interface NFTCardProps {
  nft: Coral;
  index: number;
  isPurchaseMode?: boolean; // New prop to indicate if this is in purchase mode
  onPurchaseComplete?: (purchaseData: any) => void; // Callback for purchase completion
  isSellMode?: boolean; // New prop to indicate if this is in sell mode
  onSaleComplete?: (saleData: any) => void; // Callback for sale completion
  isPreviewMode?: boolean; // New prop for preview mode
}

// Mock utility functions
const calculateTimeRemaining = (endDate: string) => {
  const now = new Date().getTime();
  const end = new Date(endDate).getTime();
  const diff = end - now;

  if (diff <= 0) return "00:00:00";

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

const isExpired = (endDate: string) => {
  return new Date().getTime() > new Date(endDate).getTime();
};

// Floating particle component
const FloatingParticle = ({ delay = 0 }: { delay?: number }) => {
  return (
    <motion.div
      className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full"
      initial={{
        opacity: 0,
        x: Math.random() * 300,
        y: Math.random() * 400,
        scale: 0,
      }}
      animate={{
        opacity: [0, 1, 0],
        y: [0, -50, -100],
        x: [0, Math.random() * 20 - 10],
        scale: [0, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        repeatDelay: Math.random() * 2,
        ease: "easeOut",
      }}
    />
  );
};

// Enhanced AnimatedButton component
const AnimatedButton = ({
  children,
  className,
  disabled,
  onClick,
  ...props
}: any) => {
  return (
    <motion.button
      className={className}
      disabled={disabled}
      onClick={onClick}
      whileHover={
        disabled
          ? {}
          : {
              scale: 1.02,
              boxShadow: "0 10px 30px rgba(42, 132, 154, 0.3)",
            }
      }
      whileTap={disabled ? {} : { scale: 0.98 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.button>
  );
};

export function NFTCard({
  nft,
  index,
  isPurchaseMode = false,
  onPurchaseComplete,
  isSellMode = false,
  onSaleComplete,
  isPreviewMode = false,
}: NFTCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(nft.endDate));
  const [isHovered, setIsHovered] = useState(false);
  const [showPurchaseInterface, setShowPurchaseInterface] = useState(false);
  const [customPercentage, setCustomPercentage] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [purchaseAmount, setPurchaseAmount] = useState(
    nft.sharePercentage || 100
  );

  // Sell mode states
  const [showSellInterface, setShowSellInterface] = useState(false);
  const [sellPercentage, setSellPercentage] = useState<string>("");
  const [sellPrice, setSellPrice] = useState<string>("");
  const [isSellProcessing, setIsSellProcessing] = useState(false);
  const [sellAmount, setSellAmount] = useState(nft.sharePercentage || 100);
  const cardRef = useRef<HTMLDivElement>(null);

  const getSellerName = (sellerId: string): string => {
    if (sellerId.startsWith("bus-")) {
      return (
        getBusinessById(sellerId as BusinessId)?.businessName ||
        "Unknown Business"
      );
    }

    // For individual sellers, return name if known
    const userAddr = sellerId.startsWith("0x") ? sellerId : undefined;
    if (!userAddr) return "Unknown Seller";

    return getUserByAddress(userAddr)?.username || formatAddress(userAddr);
  };

  const expired = isExpired(nft.endDate);

  // Mouse tracking for 3D effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 300,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 300,
    damping: 30,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(nft.endDate));
    }, 1000);
    return () => clearInterval(interval);
  }, [nft.endDate]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const x = (e.clientX - centerX) / (rect.width / 2);
    const y = (e.clientY - centerY) / (rect.height / 2);

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setIsHovered(false);
  };

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
      rotateX: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const glowVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: { duration: 0.3 },
    },
  };

  const handleCardClick = () => {
    if (isPurchaseMode && !showPurchaseInterface) {
      setShowPurchaseInterface(true);
      setCustomPercentage((nft.sharePercentage || 100).toString());
    } else if (isSellMode && !showSellInterface) {
      setShowSellInterface(true);
      setSellPercentage((nft.sharePercentage || 100).toString());
      setSellAmount(nft.sharePercentage || 100);
      // Set price based on the actual share percentage
      const suggestedPrice = (
        ((nft.pricing || 0) * (nft.sharePercentage || 100)) /
        100
      ).toFixed(2);
      setSellPrice(suggestedPrice);
    } else if (!isPurchaseMode && !isSellMode) {
      setShowModal(true);
    }
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isPurchaseMode) {
      setShowPurchaseInterface(true);
      setCustomPercentage((nft.sharePercentage || 100).toString());
    } else {
      console.log("Buy clicked for offer:", nft.id);
    }
  };

  const handlePercentageChange = (value: string) => {
    setCustomPercentage(value);
    const percentage = Math.min(
      Math.max(parseFloat(value) || 0, 0),
      nft.sharePercentage || 100
    );
    setPurchaseAmount(percentage);
  };

  const handlePurchase = async (percentage: number) => {
    setIsProcessing(true);

    try {
      // Simulate purchase process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const purchaseData = {
        nftId: nft.id,
        percentage: percentage,
        totalPrice: calculatePurchasePrice(percentage),
        newNftId: `${nft.id}-split-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      // Call the callback if provided
      if (onPurchaseComplete) {
        onPurchaseComplete(purchaseData);
      }

      setIsProcessing(false);
      setShowPurchaseInterface(false);

      // Show success (you could use a toast notification here)
      alert(
        `Successfully purchased ${percentage}% share for $${calculatePurchasePrice(
          percentage
        ).toFixed(2)}!`
      );
    } catch (error) {
      console.error("Purchase failed:", error);
      alert("Purchase failed. Please try again.");
      setIsProcessing(false);
    }
  };

  const calculatePurchasePrice = (percentage: number) => {
    const pricePerPercent = (nft.pricing || 0) / (nft.sharePercentage || 100);
    return pricePerPercent * percentage;
  };

  const closePurchaseInterface = () => {
    setShowPurchaseInterface(false);
    setCustomPercentage("");
    setPurchaseAmount(nft.sharePercentage || 100);
  };

  // Sell mode handlers
  const handleSell = async (percentage: number, price: number) => {
    setIsSellProcessing(true);

    try {
      // Simulate sell listing process
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const saleData = {
        nftId: nft.id,
        percentage: percentage,
        listingPrice: price,
        expectedRevenue: price * (percentage / 100),
        newListingId: `listing-${Date.now()}`,
        timestamp: new Date().toISOString(),
      };

      // Call the callback if provided
      if (onSaleComplete) {
        onSaleComplete(saleData);
      }

      setIsSellProcessing(false);
      setShowSellInterface(false);

      // Show success (you could use a toast notification here)
      alert(
        `Successfully listed ${percentage}% share for $${price.toFixed(2)}!`
      );
    } catch (error) {
      console.error("Listing failed:", error);
      alert("Listing failed. Please try again.");
      setIsSellProcessing(false);
    }
  };

  const calculateSellPrice = (percentage: number, pricePerUnit: number) => {
    return (pricePerUnit * percentage) / 100;
  };

  const closeSellInterface = () => {
    setShowSellInterface(false);
    setSellPercentage("");
    setSellPrice("");
    setSellAmount(nft.sharePercentage || 100);
  };

  // Dynamic split NFT info based on actual NFT data
  const splitInfo = {
    isRoot: nft.isRootNft || false,
    parentId: nft.rootNftId,
    rootId: nft.isRootNft ? nft.id : nft.rootNftId,
    share: (nft.sharePercentage || 100) / 100,
    ownerShare: (nft.sharePercentage || 100) / 100,
    totalShares: 1,
  };

  return (
    <div className="relative">
      {/* Floating particles */}
      {isHovered && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <FloatingParticle key={i} delay={i * 0.2} />
          ))}
        </div>
      )}

      <motion.div
        ref={cardRef}
        className="relative bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden group cursor-pointer"
        variants={cardVariants as any}
        initial="hidden"
        animate="visible"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={handleMouseLeave}
        onClick={handleCardClick}
        whileHover={{
          y: -8,
          transition: { duration: 0.3 },
        }}
      >
        {/* Glow effect */}
        <motion.div
          className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 blur-xl"
          variants={glowVariants}
          initial="initial"
          whileHover="hover"
        />

        {/* Inner glow */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 rounded-2xl opacity-0"
          variants={glowVariants}
          initial="initial"
          whileHover="hover"
        />

        {/* Main card content */}
        <div className="relative bg-white rounded-2xl overflow-hidden">
          {/* NFT Image Container */}
          <div className="relative aspect-square overflow-hidden">
            {/* Animated background gradient */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500"
              animate={{
                background: [
                  "linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899)",
                  "linear-gradient(45deg, #8b5cf6, #ec4899, #f59e0b)",
                  "linear-gradient(45deg, #ec4899, #f59e0b, #6366f1)",
                  "linear-gradient(45deg, #6366f1, #8b5cf6, #ec4899)",
                ],
              }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            />
            {/* Image */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
            >
              <Image
                src={nft.debtNftImageUrl || "/placeholder.svg"}
                alt={""}
                width={300}
                height={300}
                className="object-cover w-full h-full"
                onLoad={() => setImageLoaded(true)}
              />
            </motion.div>

            {/* Floating rarity badge */}
            {/* <motion.div
              className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full text-xs font-bold text-white shadow-lg"
              initial={{ opacity: 0, scale: 0, rotate: -180 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{
                delay: 0.5 + index * 0.1,
                type: "spring",
                stiffness: 300,
                damping: 20,
              }}
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, 0],
                transition: { duration: 0.3 },
              }}
            >
              <div className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>{nft.rarity?.toUpperCase() || "RARE"}</span>
              </div>
            </motion.div> */}

            {/* Time badge with pulsing effect */}
            <motion.div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-md ${
                expired ? "bg-red-500/90 text-white" : "bg-black/70 text-white"
              }`}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1 }}
            >
              <div className="flex items-center space-x-1">
                <motion.div
                  animate={expired ? {} : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                >
                  <Clock className="w-3 h-3" />
                </motion.div>
                <span className="font-mono text-xs">
                  {expired ? "EXPIRED" : timeLeft}
                </span>
              </div>
            </motion.div>

            {/* Sparkle effects */}
            {isHovered && (
              <div className="absolute inset-0 pointer-events-none">
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute"
                    style={{
                      left: `${20 + i * 15}%`,
                      top: `${20 + i * 10}%`,
                    }}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [0, 1, 0],
                      rotate: [0, 180, 360],
                    }}
                    transition={{
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Number.POSITIVE_INFINITY,
                      repeatDelay: 2,
                    }}
                  >
                    {/* <Sparkles className="w-4 h-4 text-yellow-300" /> */}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          {/* Split NFT Info Bar (moved below image, above content) */}
          <div className="w-full flex flex-row items-center justify-between gap-2 px-4 py-2 -mt-4 mb-2 rounded-xl bg-white/80 backdrop-blur-md shadow border border-slate-100">
            <div className="flex flex-col items-start min-w-[90px]">
              <span className="text-[11px] font-semibold text-slate-700 flex items-center gap-1">
                {splitInfo.isRoot ? (
                  <Star className="w-3 h-3 text-yellow-400 inline-block" />
                ) : (
                  <Zap className="w-3 h-3 text-blue-400 inline-block" />
                )}
                {splitInfo.isRoot ? "Root NFT" : `Child NFT`}
              </span>
              <span className="text-[10px] text-slate-500 mt-0.5">
                {splitInfo.isRoot
                  ? "Total Shares: 100%"
                  : `Parent: #${splitInfo.parentId}`}
              </span>
            </div>
            <div className="flex flex-col items-end min-w-[90px]">
              <span className="text-[11px] font-semibold text-blue-700">
                Share of Root NFT
              </span>
              <span className="text-[13px] font-bold text-blue-900">
                {(splitInfo.ownerShare * 100).toFixed(1)}%
              </span>
              {isPurchaseMode && (
                <span className="text-[10px] text-green-600 font-medium">
                  Available for purchase
                </span>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6 space-y-4 relative">
            {/* Title with typing effect */}
            <motion.h3
              className="font-bold text-gray-900 text-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              {nft.title}
            </motion.h3>

            {/* Owner Info with enhanced styling */}
            <motion.div
              className="flex items-center space-x-3"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <Image
                  src="https://i.pinimg.com/736x/09/0b/bc/090bbcffd9c72bc9dbcc34506b7cdcc4.jpg"
                  alt={""}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-blue-500/50"
                />
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0"
                  whileHover={{ opacity: 0.3 }}
                  transition={{ duration: 0.2 }}
                />
              </motion.div>
              <div>
                <span className="text-xs text-gray-500">Sold by</span>
                <div className="text-sm font-semibold text-gray-900">
                  {getSellerName(nft.sellerId)}
                </div>
              </div>
            </motion.div>

            {/* Token Count with animated icon */}
            <motion.div
              className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
              >
                <Coins className="w-5 h-5 text-blue-600" />
              </motion.div>
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(nft.pricing, { maximumFractionDigits: 2 })} USD
              </span>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
              >
                <Zap className="w-4 h-4 text-yellow-500" />
              </motion.div>
            </motion.div>

            {/* Enhanced Buy Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.1 }}
            >
              <AnimatedButton
                className={`w-full rounded-xl font-bold py-3 px-6 text-white relative overflow-hidden ${
                  expired
                    ? "bg-gray-400 cursor-not-allowed"
                    : isPurchaseMode
                    ? "bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 shadow-lg"
                    : "bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 shadow-lg"
                }`}
                disabled={expired}
                onClick={handleCardClick}
              >
                {!expired && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  {expired ? (
                    <>
                      <Clock className="w-4 h-4" />
                      <span>Expired</span>
                    </>
                  ) : isPurchaseMode ? (
                    <>
                      <ShoppingCart className="w-4 h-4" />
                      <span>Purchase Branch</span>
                    </>
                  ) : isSellMode ? (
                    <>
                      <DollarSign className="w-4 h-4" />
                      <span>Sell</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4" />
                      <span>Buy Now</span>
                    </>
                  )}
                </span>
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Purchase Interface Overlay */}
      <AnimatePresence>
        {showPurchaseInterface && isPurchaseMode && (
          <motion.div
            className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={closePurchaseInterface}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Purchase Interface Content */}
            <div className="p-6 flex-1 flex flex-col justify-center space-y-6">
              {/* Header */}
              <div className="text-center">
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Purchase Coral Branch
                </h3>
                <p className="text-sm text-gray-600">
                  Customize your share percentage of this coral branch
                </p>
              </div>

              {/* Quick Purchase Options */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => {
                    const fullShare = nft.sharePercentage || 100;
                    setCustomPercentage(fullShare.toString());
                    setPurchaseAmount(fullShare);
                  }}
                  className="p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-left">
                    <div className="text-sm font-bold text-blue-900">
                      Full Share
                    </div>
                    <div className="text-xs font-semibold text-blue-700">
                      {nft.sharePercentage}%
                    </div>
                    <div className="text-xs text-blue-700">
                      ${(nft.pricing || 0).toFixed(2)}
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    const halfShare = (nft.sharePercentage || 100) / 2;
                    setCustomPercentage(halfShare.toString());
                    setPurchaseAmount(halfShare);
                  }}
                  className="p-3 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-left">
                    <div className="text-sm font-bold text-purple-900">
                      Half Share
                    </div>
                    <div className="text-xs font-semibold text-purple-700">
                      {((nft.sharePercentage || 100) / 2).toFixed(1)}%
                    </div>
                    <div className="text-xs text-purple-700">
                      ${((nft.pricing || 0) / 2).toFixed(2)}
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Custom Percentage Input */}
              <div className="space-y-3">
                <label className="block text-sm font-medium text-gray-700">
                  Custom Percentage (Max: {nft.sharePercentage}%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={customPercentage}
                    onChange={(e) => handlePercentageChange(e.target.value)}
                    max={nft.sharePercentage || 100}
                    min="0"
                    step="0.1"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter percentage"
                  />
                  <Percent className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Purchase Summary */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    Purchase Amount:
                  </span>
                  <span className="font-semibold">
                    {purchaseAmount.toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Total Price:</span>
                  <span className="text-lg font-bold text-green-600">
                    ${calculatePurchasePrice(purchaseAmount).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Price per 1%:</span>
                  <span className="text-xs text-gray-500">
                    $
                    {(
                      (nft.pricing || 0) / (nft.sharePercentage || 100)
                    ).toFixed(4)}
                  </span>
                </div>
              </div>

              {/* Purchase Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={closePurchaseInterface}
                  className="py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={() => handlePurchase(purchaseAmount)}
                  disabled={isProcessing || purchaseAmount <= 0}
                  className={`py-3 px-4 rounded-lg font-medium transition-all duration-200 ${
                    isProcessing || purchaseAmount <= 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-green-500 to-blue-500 text-white hover:from-green-600 hover:to-blue-600"
                  }`}
                  whileHover={
                    !isProcessing && purchaseAmount > 0 ? { scale: 1.02 } : {}
                  }
                  whileTap={
                    !isProcessing && purchaseAmount > 0 ? { scale: 0.98 } : {}
                  }
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center gap-2">
                      <motion.div
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                      Processing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <CreditCard className="w-4 h-4" />
                      Purchase
                    </div>
                  )}
                </motion.button>
              </div>

              {purchaseAmount <= 0 && (
                <div className="flex items-center gap-2 text-red-600 justify-center">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-sm">
                    Please enter a valid percentage greater than 0
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sell Interface Overlay */}
      <AnimatePresence>
        {showSellInterface && isSellMode && (
          <motion.div
            className="absolute inset-0 bg-white/95 backdrop-blur-sm rounded-2xl z-10 flex flex-col"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Close Button */}
            <button
              onClick={closeSellInterface}
              className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-full transition-colors z-20"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>

            {/* Sell Interface Content */}
            <div className="p-4 flex-1 flex flex-col justify-center space-y-4">
              {/* Header */}
              <div className="text-center">
                <h3 className="text-lg font-bold text-gray-900 mb-1">
                  List Coral Branch for Sale
                </h3>
                <p className="text-xs text-gray-600">
                  Choose how much of your share to sell and set your price
                </p>
              </div>

              {/* Quick Sell Options */}
              <div className="grid grid-cols-2 gap-3">
                <motion.button
                  onClick={() => {
                    const fullShare = nft.sharePercentage || 100;
                    setSellPercentage(fullShare.toString());
                    setSellAmount(fullShare);
                    // Set a more reasonable default price based on the share percentage
                    const suggestedPrice = (
                      ((nft.pricing || 0) * fullShare) /
                      100
                    ).toFixed(2);
                    setSellPrice(suggestedPrice);
                  }}
                  className="p-3 bg-orange-50 border border-orange-200 rounded-lg hover:bg-orange-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-left">
                    <div className="text-sm font-bold text-orange-900">
                      Full Share
                    </div>
                    <div className="text-xs font-semibold text-orange-700">
                      {nft.sharePercentage}%
                    </div>
                    <div className="text-xs text-orange-700">
                      Suggested: $
                      {(
                        ((nft.pricing || 0) * (nft.sharePercentage || 100)) /
                        100
                      ).toFixed(2)}
                    </div>
                  </div>
                </motion.button>

                <motion.button
                  onClick={() => {
                    const halfShare = (nft.sharePercentage || 100) / 2;
                    setSellPercentage(halfShare.toString());
                    setSellAmount(halfShare);
                    // Set a more reasonable default price based on the share percentage
                    const suggestedPrice = (
                      ((nft.pricing || 0) * halfShare) /
                      100
                    ).toFixed(2);
                    setSellPrice(suggestedPrice);
                  }}
                  className="p-3 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-left">
                    <div className="text-sm font-bold text-red-900">
                      Half Share
                    </div>
                    <div className="text-xs font-semibold text-red-700">
                      {((nft.sharePercentage || 100) / 2).toFixed(1)}%
                    </div>
                    <div className="text-xs text-red-700">
                      Suggested: $
                      {(
                        ((nft.pricing || 0) * (nft.sharePercentage || 100)) /
                        2 /
                        100
                      ).toFixed(2)}
                    </div>
                  </div>
                </motion.button>
              </div>

              {/* Custom Percentage Input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Percentage to Sell (Max: {nft.sharePercentage}%)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sellPercentage}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Limit to reasonable decimal places
                      if (
                        value.includes(".") &&
                        value.split(".")[1]?.length > 1
                      ) {
                        return;
                      }
                      setSellPercentage(value);
                      const percentage = Math.min(
                        Math.max(parseFloat(value) || 0, 0),
                        nft.sharePercentage || 100
                      );
                      setSellAmount(percentage);
                    }}
                    max={nft.sharePercentage || 100}
                    min="0"
                    step="0.1"
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    placeholder="0.0"
                  />
                  <Percent className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Custom Price Input */}
              <div className="space-y-2">
                <label className="block text-xs font-medium text-gray-700">
                  Listing Price (USD)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={sellPrice}
                    onChange={(e) => {
                      const value = e.target.value;
                      // Limit to reasonable number of decimal places
                      if (
                        value.includes(".") &&
                        value.split(".")[1]?.length > 2
                      ) {
                        return;
                      }
                      setSellPrice(value);
                    }}
                    min="0"
                    step="0.01"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-sm"
                    placeholder="0.00"
                  />
                  <DollarSign className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                </div>
              </div>

              {/* Sell Summary */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Selling Amount:</span>
                  <span className="font-semibold">
                    {sellAmount.toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Listing Price:</span>
                  <span className="text-lg font-bold text-orange-600">
                    ${(parseFloat(sellPrice) || 0).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">Price per 1%:</span>
                  <span className="text-xs text-gray-500">
                    $
                    {sellAmount > 0
                      ? ((parseFloat(sellPrice) || 0) / sellAmount).toFixed(2)
                      : "0.00"}
                  </span>
                </div>
              </div>

              {/* Sell Buttons */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={closeSellInterface}
                  className="py-2 px-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <motion.button
                  onClick={() =>
                    handleSell(sellAmount, parseFloat(sellPrice) || 0)
                  }
                  disabled={
                    isSellProcessing ||
                    sellAmount <= 0 ||
                    !sellPrice ||
                    parseFloat(sellPrice) <= 0
                  }
                  className={`py-2 px-3 rounded-lg font-medium transition-all duration-200 text-sm ${
                    isSellProcessing ||
                    sellAmount <= 0 ||
                    !sellPrice ||
                    parseFloat(sellPrice) <= 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600"
                  }`}
                  whileHover={
                    !isSellProcessing &&
                    sellAmount > 0 &&
                    sellPrice &&
                    parseFloat(sellPrice) > 0
                      ? { scale: 1.02 }
                      : {}
                  }
                  whileTap={
                    !isSellProcessing &&
                    sellAmount > 0 &&
                    sellPrice &&
                    parseFloat(sellPrice) > 0
                      ? { scale: 0.98 }
                      : {}
                  }
                >
                  {isSellProcessing ? (
                    <div className="flex items-center justify-center gap-1">
                      <motion.div
                        className="w-3 h-3 border-2 border-white border-t-transparent rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 1,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "linear",
                        }}
                      />
                      Listing...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-1">
                      <DollarSign className="w-3 h-3" />
                      Sell
                    </div>
                  )}
                </motion.button>
              </div>

              {(sellAmount <= 0 ||
                !sellPrice ||
                parseFloat(sellPrice) <= 0) && (
                <div className="flex items-center gap-1 text-red-600 justify-center">
                  <AlertCircle className="w-3 h-3" />
                  <span className="text-xs">
                    Please enter valid percentage and price greater than 0
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Original Modal */}
      {!isPurchaseMode && !isSellMode && (
        <CoralDetailModal
          coral={nft}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          onClick={(e: any) => {
            e.stopPropagation();
            handleBuyClick(e);
          }}
        />
      )}
    </div>
  );
}
