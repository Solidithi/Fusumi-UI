"use client";

import { motion } from "framer-motion";
import type { InvoiceData } from "@/types/dashboard";
import { calculateDuration } from "@/utils/address";
import { AddressCell } from "./AddressCell";
import { AnimatedButton } from "../ui/Button";
import { useState } from "react";
import { RepayModal } from "../ui/modal/RepayModal";
import { RepayModalData } from "@/types/modal";

interface CustomerInvoiceTableProps {
  invoices: InvoiceData[];
}

export function CustomerInvoiceTable({ invoices }: CustomerInvoiceTableProps) {
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [repayModal, setRepayModal] = useState<{
    isOpen: boolean;
    data?: RepayModalData;
  }>({ isOpen: false });
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const rowVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  const columns = [
    { key: "NFT Holder", label: "Address Owner" },
    { key: "addressDebtor", label: "Address Debtor" },
    { key: "unitDebt", label: "Unit Debt" },
    { key: "endIn", label: "End In" },
    { key: "fieldCompany", label: "Field Company" },
    { key: "action", label: "Action" },
  ];
  const handleRepayClick = (invoice: InvoiceData) => {
    setRepayModal({
      isOpen: true,
      data: {
        invoiceId: invoice.id,
        addressOwner: invoice.addressOwner,
        addressDebtor: invoice.addressDebtor,
        unitDebt: invoice.unitDebt,
        fieldCompany: invoice.fieldCompany,
        endDate: invoice.endDate,
      },
    });
  };

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Table Header */}
      <div className="bg-[#F8EDE2] px-6 py-4">
        <div className="grid grid-cols-6 gap-4">
          {columns.map((column) => (
            <motion.div
              key={column.key}
              className="text-sm font-medium text-[#445E6D]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
            >
              {column.label}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Table Body */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {invoices.map((invoice, index) => (
          <motion.div
            key={invoice.id}
            className="px-6 py-4 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
            variants={rowVariants as any}
            whileHover={{ backgroundColor: "#f9fafb" }}
            transition={{ duration: 0.02 }}
          >
            <div className="grid grid-cols-6 gap-4 items-center">
              <AddressCell address={invoice.addressOwner} />
              <AddressCell address={invoice.addressDebtor} />
              <div className="text-sm text-gray-900 font-semibold">
                {invoice.unitDebt.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600 font-mono">
                {calculateDuration(invoice.startDate, invoice.endDate)}
              </div>
              <motion.div
                className="text-sm text-[#2a849a] font-medium"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {invoice.fieldCompany}
              </motion.div>
              {invoice.status === "unpaid" ? (
                <AnimatedButton
                  onClick={() => handleRepayClick(invoice)}
                  className="bg-[#2a849a] text-white rounded-xl p-3"
                >
                  Repay
                </AnimatedButton>
              ) : (
                <AnimatedButton
                  className="bg-slate-400 text-white rounded-xl p-3 cursor-not-allowed"
                  disabled
                >
                  Repay
                </AnimatedButton>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Empty State */}
      {invoices.length === 0 && (
        <motion.div
          className="px-6 py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500">
            No invoices found matching your criteria.
          </p>
        </motion.div>
      )}

      {/* Repay Modal */}
      {repayModal.data && (
        <RepayModal
          isOpen={repayModal.isOpen}
          onClose={() => setRepayModal({ isOpen: false })}
          data={repayModal.data}
        />
      )}
    </motion.div>
  );
}
