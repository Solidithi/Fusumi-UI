"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import {
  Eye,
  Edit,
  Trash2,
  Calendar,
  DollarSign,
  FileText,
  User,
  MapPin,
  Badge,
} from "lucide-react";
import { formatAddress } from "@/utils/address";
import { Card, CardContent } from "../ui/Card";
import { AnimatedButton } from "../ui/Button";
import { Coral } from "@/types/coral";
import Image from "next/image";
export interface OfferCardProps {
  offer: any;
  index: number;
  onView?: (offer: Coral) => void;
}

export function OfferCard({ offer, index, onView }: OfferCardProps) {
  const [isHovered, setIsHovered] = useState(false);

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
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "expired":
        return "bg-red-100 text-red-800 border-red-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <motion.div
      variants={cardVariants as any}
      initial="hidden"
      animate="visible"
      whileHover={{
        y: -8,
        transition: { duration: 0.2 },
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full bg-white shadow-sm border border-gray-200 hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <CardContent className="p-6 space-y-4">
          {/* Header with Status */}
          {/* <div className="flex items-center justify-between">
            <Badge className={`${getStatusColor(offer.status)} font-medium rounded-full`}>
              {offer.status.toUpperCase()}
            </Badge>
            <motion.div
              className="flex space-x-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: isHovered ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <AnimatedButton
                // variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-600"
                onClick={() => onView?.(offer)}
              >
                <Eye className="h-4 w-4" />
              </AnimatedButton>
              <AnimatedButton
                // variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-green-50 hover:text-green-600"
                onClick={() => onEdit?.(offer)}
              >
                <Edit className="h-4 w-4" />
              </AnimatedButton>
              <AnimatedButton
                // variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                onClick={() => onDelete?.(offer.id)}
              >
                <Trash2 className="h-4 w-4" />
              </AnimatedButton>
            </motion.div>
          </div> */}

          {/* Invoice Id */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <MapPin className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Invoice Id
              </span>
            </div>
            <p className="text-sm font-mono text-gray-900 bg-gray-50 p-2 rounded">
              {formatAddress(offer.invoiceId || "Unknown")}
            </p>
          </div>

          {/* Pricing */}
          <div className="flex items-center space-x-2">
            <DollarSign className="h-4 w-4 text-green-600" />
            <span className="text-lg font-bold text-gray-900">
              ${offer.pricing.toLocaleString()}
            </span>
          </div>

          {/* Contact Info */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Contact</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8">
                <Image
                  src="https://i.pinimg.com/736x/f6/c7/23/f6c723cfdf39acfa4c34e56cc68d7082.jpg"
                  alt={offer.contactInfo.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
                {/* <div className="text-xs bg-[#2a849a] text-white">
                  {offer.contactInfo.name
                    .split(" ")
                    .map((n: any) => n[0])
                    .join("")}
                </div> */}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {offer.contactInfo.name}
                </p>
                <p className="text-xs text-gray-500">
                  {offer.contactInfo.company}
                </p>
              </div>
            </div>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">
                Duration
              </span>
            </div>
            <div className="text-sm text-gray-600">
              {formatDate(offer.startDate)} - {formatDate(offer.endDate)}
            </div>
          </div>

          {/* Agreements */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <FileText className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-600">
                {offer.agreements.length} agreement
                {offer.agreements.length !== 1 ? "s" : ""}
              </span>
            </div>
            <span className="text-xs text-gray-400">
              Created {formatDate(offer.createdAt)}
            </span>
          </div>

          {/* Action AnimatedButton */}
          <motion.div
            className="pt-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <AnimatedButton
              className="w-full bg-[#2a849a] hover:bg-[#2a849a]/90 text-white p-3 rounded-xl"
              onClick={() => onView?.(offer)}
            >
              View Details
            </AnimatedButton>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
