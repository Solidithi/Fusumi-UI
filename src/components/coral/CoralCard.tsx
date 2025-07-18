"use client";

import type React from "react";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Clock, Coins, Star, Zap } from "lucide-react";
import { CoralDetailModal } from "../ui/modal/CoralDetailModal";
import type { Coral } from "@/types/coral";
import { getBusinessById } from "@/utils/businessUtils";
import { BusinessId } from "@/types/business";
import { getUserByAddress } from "@/utils/userUtils";
import { formatAddress } from "@/utils/address";

interface CoralCardProps {
  coral: Coral;
  index: number;
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

export function CoralCard({ coral: nft, index }: CoralCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(nft.endDate));
  const [isHovered, setIsHovered] = useState(false);
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
    setShowModal(true);
  };

  const handleBuyClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log("Buy clicked for offer:", nft.id);
  };

  // Mock split NFT info for demonstration
  const splitInfo = {
    isRoot: true, // or false if it's a child NFT
    parentId: null, // or parent NFT id if child
    rootId: nft.id, // always the root NFT id
    share: 0.3, // e.g., 0.3 means 30% share
    ownerShare: 0.3, // for this user
    totalShares: 1, // sum of all shares
    // Add more fields as needed
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
                {nft.pricing} USD
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
                    : "bg-gradient-to-r from-[#3587A3] to-[#EDCCBB] hover:from-[#307c96] hover:to-[#cfa895] shadow-lg"
                }`}
                disabled={expired}
                onClick={handleBuyClick}
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
      <CoralDetailModal
        coral={nft}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClick={(e: any) => {
          e.stopPropagation();
          handleBuyClick(e); // hoặc logic khác
        }}
      />
    </div>
  );
}
