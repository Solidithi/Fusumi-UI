"use client";

import { motion } from "framer-motion";
import { formatAddress } from "@/utils/address";
import { CopyButton } from "../ui/CoppyButton";

interface AddressCellProps {
  address: string;
  className?: string;
}

export function AddressCell({ address, className = "" }: AddressCellProps) {
  return (
    <motion.div
      className={`flex items-center space-x-2 group ${className}`}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.2 }}
    >
      <span className="text-sm text-gray-900 font-mono">
        {formatAddress(address)}
      </span>
      <motion.div
        initial={{ opacity: 1, scale: 1 }}
        // whileHover={{ opacity: 1, scale: 1 }}
        // className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
      >
        <CopyButton text={address} />
      </motion.div>
    </motion.div>
  );
}
