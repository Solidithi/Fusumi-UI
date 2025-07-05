"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Copy, Check } from "lucide-react";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      className={`h-6 w-6 p-0  ${className}`}
      onClick={handleCopy}
    >
      <motion.div
        initial={false}
        animate={{ scale: copied ? 0.8 : 1 }}
        transition={{ duration: 0.2 }}
      >
        {copied ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <Check className="w-3 h-3 text-green-600" />
          </motion.div>
        ) : (
          <Copy className="w-3 h-3 text-black hover:text-gray-600" />
        )}
      </motion.div>
    </button>
  );
}
