"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Edit,
  Trash2,
  Download,
  Calendar,
  DollarSign,
  FileText,
  User,
  MapPin,
  Building,
  Phone,
  Mail,
  Clock,
  Badge,
} from "lucide-react";
import type { Coral } from "@/types/coral";
import { Portal } from "../Portal";
import { Separator } from "@radix-ui/react-separator";
import { AnimatedButton } from "../Button";
import Image from "next/image";

interface OfferDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: Coral;
}

export function OfferDetailModal({
  isOpen,
  onClose,
  offer,
}: OfferDetailModalProps) {
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
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const calculateDuration = () => {
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 30) {
      return `${diffDays} days`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} month${months > 1 ? "s" : ""}`;
    } else {
      const years = Math.floor(diffDays / 365);
      return `${years} year${years > 1 ? "s" : ""}`;
    }
  };

  return (
    <Portal>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 text-black"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
              variants={modalVariants as any}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.h2
                      className="text-2xl font-bold text-gray-900"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      Offer Details
                    </motion.h2>
                    {/* <Badge
                      className={`${getStatusColor(offer.status)} font-medium`}
                    >
                      {offer.status.toUpperCase()}
                    </Badge> */}
                  </div>

                  <div className="flex items-center space-x-2">
                    <AnimatedButton
                      //   variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="p-2 hover:bg-gray-100 rounded-full"
                    >
                      <X className="w-5 h-5 text-gray-500" />
                    </AnimatedButton>
                  </div>
                </div>
              </div>

              {/* Content */}
              <motion.div
                className="p-6 space-y-8"
                variants={contentVariants}
                initial="hidden"
                animate="visible"
              >
                {/* Overview Section */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  variants={itemVariants as any}
                >
                  {/* Pricing Card */}
                  <div className="bg-gradient-to-br from-[#2a849a] to-[#3587A3] rounded-xl p-6 text-white">
                    <div className="flex items-center space-x-3 mb-4">
                      <DollarSign className="w-6 h-6" />
                      <h3 className="text-lg font-semibold">Total Value</h3>
                    </div>
                    <p className="text-3xl font-bold">
                      ${offer.pricing.toLocaleString()}
                    </p>
                    <p className="text-white/80 mt-2">
                      Duration: {calculateDuration()}
                    </p>
                  </div>

                  {/* Duration Card */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <div className="flex items-center space-x-3 mb-4">
                      <Calendar className="w-6 h-6 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Offer Timeline
                      </h3>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Start:</span>
                        <span className="font-medium">
                          {formatDate(offer.startDate)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">End:</span>
                        <span className="font-medium">
                          {formatDate(offer.endDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Invoice Id Section */}
                <motion.div
                  className="bg-gray-50 rounded-xl p-6"
                  variants={itemVariants as any}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    {/* <MapPin className="w-5 h-5 text-gray-600" /> */}
                    <h3 className="text-lg font-semibold text-gray-900">
                      Invoice Id
                    </h3>
                  </div>
                  <div className="bg-white rounded-lg p-4 border">
                    <p className="font-mono text-sm text-gray-900 break-all">
                      {offer.invoiceId}
                    </p>
                    <div className="flex items-center space-x-2 mt-3">
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        className="text-xs bg-gray-100 p-2 rounded-lg"
                      >
                        Copy Address
                      </AnimatedButton>
                      <AnimatedButton
                        variant="outline"
                        size="sm"
                        className="text-xs bg-gray-100 p-2 rounded-lg"
                      >
                        View on Explorer
                      </AnimatedButton>
                    </div>
                  </div>
                </motion.div>

                {/* Contact Information Section */}
                <motion.div
                  className="bg-gray-50 rounded-xl p-6"
                  variants={itemVariants as any}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <User className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Contact Information
                    </h3>
                  </div>

                  <div className="bg-white rounded-lg p-6 space-y-6">
                    {/* Contact Header */}
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16">
                        <Image
                          src="https://i.pinimg.com/736x/30/5d/04/305d04df00db574e1caa49ef5c953cbf.jpg"
                          alt={offer.contactInfo.name}
                          width={64}
                          height={64}
                          className="rounded-full"
                        />
                        {/* <div className="text-lg bg-[#2a849a] text-white">
                          {offer.contactInfo.name
                            .split(" ")
                            .map((n: any) => n[0])
                            .join("")}
                        </div> */}
                      </div>
                      <div>
                        <h4 className="text-xl font-semibold text-gray-900">
                          {offer.contactInfo.name}
                        </h4>
                        <p className="text-gray-600">
                          {offer.contactInfo.company}
                        </p>
                      </div>
                    </div>

                    <Separator />

                    {/* Contact Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="font-medium text-gray-900">
                              {offer.contactInfo.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-600">Phone</p>
                            <p className="font-medium text-gray-900">
                              {offer.contactInfo.phone}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Building className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Company</p>
                            <p className="font-medium text-gray-900">
                              {offer.contactInfo.company}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-start space-x-3">
                          <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                          <div>
                            <p className="text-sm text-gray-600">Address</p>
                            <p className="font-medium text-gray-900">
                              {offer.contactInfo.address}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Agreements Section */}
                <motion.div
                  className="bg-gray-50 rounded-xl p-6"
                  variants={itemVariants as any}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        Agreements & Documents
                      </h3>
                    </div>
                    <Badge className="bg-white">
                      {offer.agreements.length} files
                    </Badge>
                  </div>

                  <div className="space-y-3">
                    {offer.agreements.map((agreement: any, index: any) => (
                      <motion.div
                        key={index}
                        className="bg-white rounded-lg p-4 flex items-center justify-between border hover:shadow-sm transition-shadow"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-red-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {agreement}
                            </p>
                            <p className="text-sm text-gray-500">
                              PDF Document
                            </p>
                          </div>
                        </div>
                        <AnimatedButton
                          variant="outline"
                          size="sm"
                          className="flex items-center"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          <span>Download</span>
                        </AnimatedButton>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Timeline Section */}
                <motion.div
                  className="bg-gray-50 rounded-xl p-6"
                  variants={itemVariants as any}
                >
                  <div className="flex items-center space-x-3 mb-6">
                    <Clock className="w-5 h-5 text-gray-600" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Timeline
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Offer Created
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDateTime(offer.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          Project Start
                        </p>
                        <p className="text-sm text-gray-500">
                          {formatDate(offer.startDate)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">Project End</p>
                        <p className="text-sm text-gray-500">
                          {formatDate(offer.endDate)}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Action AnimatedButtons */}
                <motion.div
                  className="flex justify-end space-x-4 pt-6 border-t border-gray-200"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <AnimatedButton
                    variant="outline"
                    onClick={onClose}
                    className="px-6 bg-slate-100 py-2 rounded-xl"
                  >
                    Close
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
