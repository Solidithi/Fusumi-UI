import { useState } from "react";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/TextArea";
import { AnimatedButton } from "@/components/ui/Button";
import { InvoiceDetailData } from "@/types/modal";

interface InvoiceDetailProps {
  invoiceData: InvoiceDetailData;
}

export function InvoiceDetail({ invoiceData }: InvoiceDetailProps) {
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
    <>
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
              Payment Start
            </label>
            <Input
              value={invoiceData.startDate}
              readOnly
              className="bg-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Due
            </label>
            <Input value={invoiceData.endDate} readOnly className="bg-white" />
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
              <Input value={product.name} readOnly className="bg-white" />
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
              <Input value={product.quantity} readOnly className="bg-white" />
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
    </>
  );
}
