"use client";

import { motion } from "framer-motion";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ServiceData } from "@/types/market";
import { AnimatedButton } from "../ui/Button";
import Image from "next/image";
import { useState } from "react";
import { getServiceDetail, getServiceSubscriptionData } from "@/lib/data";
import { ServiceDetailModal } from "../ui/modal/ServiceDetailModal";
import { SubscriptionFormModal } from "../ui/modal/SubscriptionFormModal";

interface ServiceRowProps {
  service: ServiceData;
  index: number;
}

export function ServiceRow({ service, index }: ServiceRowProps) {
  const [showModal, setShowModal] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);

  const rowVariants = {
    hidden: {
      opacity: 0,
      x: -50,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
        ease: "easeOut",
      },
    },
  };

  const handleRowClick = () => {
    setShowModal(true);
  };

  const handleSubscribeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowSubscriptionModal(true);
  };
  return (
    <div className="">
      <motion.div
        className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
        variants={rowVariants as any}
        initial="hidden"
        animate="visible"
        whileHover={{
          scale: 1.01,
          transition: { duration: 0.2 },
        }}
        onClick={handleRowClick}
      >
        <div className="flex items-center justify-between">
          {/* Business Info */}
          <div className="flex items-center space-x-4">
            <motion.div
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-12 h-12">
                <Image
                  src="https://i.pinimg.com/736x/1c/a3/1e/1ca31e7afd314c805b38cadfd7672c13.jpg"
                  alt={service.businessName}
                  width={40}
                  height={40}
                  className="w-full h-full rounded-full object-cover border-2 border-[#2a849a] shadow-sm hover:shadow-md transition-shadow duration-300"
                />
                {/* <div className="bg-[#2a849a] text-white font-semibold">
                {service.businessName.slice(0, 2).toUpperCase()}
              </div> */}
              </div>
            </motion.div>

            <div>
              <motion.h3
                className="font-semibold text-gray-900 text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 + index * 0.1 }}
              >
                {service.businessName}
              </motion.h3>
              <motion.p
                className="text-gray-600 text-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                {service.serviceName}
              </motion.p>
            </div>
          </div>

          {/* Price and Subscribe */}
          <div className="flex items-center space-x-4">
            <motion.div
              className="text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
            >
              <p className="text-sm text-gray-500">Price</p>
              <p className="text-lg font-bold text-gray-900">
                ${service.price}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <AnimatedButton
                className="bg-[#2a849a] hover:bg-[#2a849a]/90 text-white px-6 py-2 rounded-lg font-medium"
                //   asChild
                onClick={(e) => {
                  e.stopPropagation();
                  handleSubscribeClick(e); // hoặc logic khác
                }}
              >
                {/* <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2 }} 
                >*/}
                Subscribe
                {/* </motion.button> */}
              </AnimatedButton>
            </motion.div>
          </div>
        </div>
      </motion.div>
      <ServiceDetailModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onClick={(e) => {
          e.stopPropagation();
          handleSubscribeClick(e); // hoặc logic khác
        }}
        serviceData={getServiceDetail(service.id)}
      />
      <SubscriptionFormModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        subscriptionData={getServiceSubscriptionData(service.id)}
      />
    </div>
  );
}
