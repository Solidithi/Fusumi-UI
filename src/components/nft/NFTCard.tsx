"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Coins } from "lucide-react";
import type { NFTData } from "@/types/nft";
import { AnimatedButton } from "../ui/Button";
import { calculateTimeRemaining, isExpired } from "@/utils/time";

interface NFTCardProps {
  nft: NFTData;
  index: number;
}

export function NFTCard({ nft, index }: NFTCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  // const timeRemaining = calculateTimeRemaining(nft.startDate, nft.endDate);
  const [timeLeft, setTimeLeft] = useState(calculateTimeRemaining(nft.endDate));
  const expired = isExpired(nft.endDate);
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(nft.endDate));
    }, 1000);

    return () => clearInterval(interval); // cleanup khi component unmount
  }, [nft.endDate]);
  const cardVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        delay: index * 0.05,
        ease: "easeOut",
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  return (
    <motion.div
      className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-lg transition-shadow duration-300"
      variants={cardVariants as any}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -4,
        transition: { duration: 0.2 },
      }}
    >
      {/* NFT Image */}
      <div className="relative aspect-square overflow-hidden">
        {/* Background gradient matching Figma */}
        {/* <div className="absolute inset-0 bg-gradient-to-br from-orange-400 via-orange-500 to-red-500" /> */}

        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          variants={imageVariants as any}
          initial="hidden"
          animate="visible"
        >
          <Image
            src={nft.image}
            alt={nft.title}
            width={300}
            height={300}
            // fill
            className="object-cover"
            onLoad={() => setImageLoaded(true)}
          />
        </motion.div>

        {/* Rarity Badge */}
        {/* <motion.div
          className="absolute top-3 left-3 px-3 py-1 bg-[#2a849a] rounded-full text-xs font-medium text-white"
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 + index * 0.05 }}
        >
          {nft.rarity?.toUpperCase() || "COMMON"}
        </motion.div> */}

        {/* Time Remaining Badge */}
        {/* <motion.div
          className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${
            expired
              ? "bg-red-500 text-white"
              : "bg-black/70 text-white backdrop-blur-sm"
          }`}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 + index * 0.05 }}
        >
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3" />
            <span className="font-mono text-xs">
              {expired ? "EXPIRED" : timeRemaining}
            </span>
          </div>
        </motion.div> */}
      </div>

      {/* Card Content */}
      <div className="p-4 space-y-3">
        {/* Title */}
        <motion.h3
          className="font-semibold text-gray-900 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 + index * 0.05 }}
        >
          {nft.title}
        </motion.h3>

        {/* Owner Info */}
        <motion.div
          className="flex items-center space-x-2"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 + index * 0.05 }}
        >
          {/* <Avatar className="w-5 h-5"> */}
          <Image
            src="https://i.pinimg.com/736x/09/0b/bc/090bbcffd9c72bc9dbcc34506b7cdcc4.jpg"
            alt={nft.owner}
            width={200}
            height={200}
            className="w-5 h-5 rounded-full object-cover"
          />
          {/* <AvatarFallback className="text-xs bg-gray-200">
              {nft.owner[0]}
            </AvatarFallback> */}
          {/* </Avatar> */}
          <span className="text-xs text-gray-500">Owned by</span>
          <span className="text-xs font-medium text-gray-900">{nft.owner}</span>
        </motion.div>

        {/* Token Count with new symbol */}
        <motion.div
          className="flex items-center space-x-1"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 + index * 0.05 }}
        >
          <Coins className="w-4 h-4 text-[#2a849a]" />
          <span className="text-sm font-semibold text-gray-900">
            {nft.tokenCount} Token
          </span>
        </motion.div>

        {/* Time Display */}
        <motion.div
          className="flex items-center justify-between text-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + index * 0.05 }}
        >
          <div className="flex items-center space-x-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-gray-500">Duration:</span>
          </div>
          <span
            className={`font-mono font-medium ${
              expired ? "text-red-500" : "text-gray-700"
            }`}
          >
            {/* {timeRemaining} */}
            {timeLeft}
          </span>
        </motion.div>

        {/* Buy AnimatedButton */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 + index * 0.05 }}
        >
          <AnimatedButton
            className={`w-full rounded-lg font-medium py-2 ${
              expired
                ? "bg-gray-400 hover:bg-gray-400 cursor-not-allowed"
                : "bg-[#2a849a] hover:bg-[#2a849a]/90"
            } text-white`}
            disabled={expired}
            // whileHover={expired ? {} : { scale: 1.02 }}
            // whileTap={expired ? {} : { scale: 0.98 }}
            // transition={{ duration: 0.2 }}
            // asChild
          >
            {expired ? "Expired" : "Buy"}
          </AnimatedButton>
        </motion.div>
      </div>
    </motion.div>
  );
}
