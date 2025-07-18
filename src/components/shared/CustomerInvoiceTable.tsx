"use client";

import { motion } from "framer-motion";
import type { EnhancedInvoiceData, InvoiceSortConfig } from "@/types/dashboard";
import { calculateDuration } from "@/utils/address";
import { AnimatedButton } from "../ui/Button";
import { useState, useMemo } from "react";
import { RepayModal } from "../ui/modal/RepayModal";
import { RepayModalData } from "@/types/modal";
import {
  getFullAddressInfo,
  formatCurrency,
  formatDate,
  sortInvoices,
} from "@/utils/invoiceUtils";

// Simple SVG Icons for sorting
const ChevronUpIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m4.5 15.75 7.5-7.5 7.5 7.5"
    />
  </svg>
);

const ChevronDownIcon = ({ className }: { className: string }) => (
  <svg
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="m19.5 8.25-7.5 7.5-7.5-7.5"
    />
  </svg>
);

interface CustomerInvoiceTableProps {
  invoices: EnhancedInvoiceData[];
  onInvoiceUpdate?: (invoiceId: string, newStatus: string) => void;
}

export function CustomerInvoiceTable({
  invoices,
  onInvoiceUpdate,
}: CustomerInvoiceTableProps) {
  const [isRepayModalOpen, setIsRepayModalOpen] = useState(false);
  const [repayModal, setRepayModal] = useState<{
    isOpen: boolean;
    data?: RepayModalData;
  }>({ isOpen: false });

  const [sortConfig, setSortConfig] = useState<InvoiceSortConfig>({
    field: "createdAt",
    direction: "desc",
  });

  // Sort invoices based on current sort configuration
  const sortedInvoices = useMemo(() => {
    return sortInvoices(invoices, sortConfig);
  }, [invoices, sortConfig]);

  const handleSort = (field: InvoiceSortConfig["field"]) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

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
    { key: "nftHolder", label: "NFT Holder", sortable: false },
    { key: "totalValue", label: "Unit Debt", sortable: true },
    { key: "endDate", label: "Due Date", sortable: true },
    { key: "fieldCompany", label: "Field Company", sortable: false },
    { key: "createdAt", label: "Created", sortable: true },
    { key: "action", label: "Action", sortable: false },
  ];
  const handleRepayClick = (invoice: EnhancedInvoiceData) => {
    setRepayModal({
      isOpen: true,
      data: {
        invoiceId: invoice.id,
        unitDebt: invoice.totalValue || 0,
      },
    });
  };

  const handleRepaySuccess = (invoiceId: string) => {
    if (onInvoiceUpdate) {
      onInvoiceUpdate(invoiceId, "PAID");
    }
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
              className={`text-sm font-medium text-[#445E6D] ${
                column.sortable
                  ? "cursor-pointer hover:text-[#2a849a] transition-colors"
                  : ""
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() =>
                column.sortable &&
                handleSort(column.key as InvoiceSortConfig["field"])
              }
            >
              <div className="flex items-center space-x-1">
                <span>{column.label}</span>
                {column.sortable && (
                  <div className="flex flex-col">
                    {sortConfig.field === column.key ? (
                      sortConfig.direction === "asc" ? (
                        <ChevronUpIcon className="w-3 h-3 text-[#2a849a]" />
                      ) : (
                        <ChevronDownIcon className="w-3 h-3 text-[#2a849a]" />
                      )
                    ) : (
                      <div className="w-3 h-3 opacity-30">
                        <ChevronUpIcon className="w-3 h-3" />
                      </div>
                    )}
                  </div>
                )}
              </div>
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
        {sortedInvoices.map((invoice, index) => {
          const ownerInfo = getFullAddressInfo(
            invoice.ownerAddress,
            invoice.ownerAlias,
            invoice.ownerName,
            invoice.ownerType
          );

          return (
            <motion.div
              key={invoice.id}
              className="px-6 py-4 border-b border-gray-100 last:border-b-0 transition-colors duration-200"
              variants={rowVariants as any}
              whileHover={{ backgroundColor: "#f9fafb" }}
              transition={{ duration: 0.02 }}
            >
              <div className="grid grid-cols-6 gap-4 items-center">
                {/* NFT Holder */}
                <div className="flex flex-col">
                  <span
                    className="text-sm font-medium text-gray-900 truncate"
                    title={ownerInfo.title}
                  >
                    {ownerInfo.display}
                  </span>
                  {ownerInfo.type && (
                    <span className="text-xs text-gray-500 capitalize">
                      {ownerInfo.type}
                    </span>
                  )}
                </div>

                {/* Unit Debt */}
                <div className="text-sm text-gray-900 font-semibold">
                  {formatCurrency(invoice.totalValue || 0)}
                </div>

                {/* Due Date */}
                <div className="text-sm text-gray-600 font-mono">
                  {formatDate(invoice.endDate)}
                </div>

                {/* Field Company */}
                <motion.div
                  className="text-sm text-[#2a849a] font-medium"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  {invoice.businessType || "N/A"}
                </motion.div>

                {/* Created */}
                <div className="text-sm text-gray-600">
                  {formatDate(invoice.createdAt)}
                </div>

                {/* Action */}
                {invoice.paidStatus === "UNPAID" ? (
                  <AnimatedButton
                    onClick={() => handleRepayClick(invoice)}
                    className="bg-[#2a849a] text-white rounded-xl p-3"
                  >
                    Repay
                  </AnimatedButton>
                ) : invoice.paidStatus === "PENDING" ? (
                  <AnimatedButton
                    className="bg-yellow-500 text-white rounded-xl p-3 cursor-not-allowed"
                    disabled
                  >
                    Pending
                  </AnimatedButton>
                ) : invoice.paidStatus === "OVERDUE" ? (
                  <AnimatedButton
                    className="bg-red-900 text-white rounded-xl p-3 cursor-not-allowed"
                    disabled
                  >
                    Overdue
                  </AnimatedButton>
                ) : (
                  <AnimatedButton className="bg-slate-400 text-white rounded-xl p-3 cursor-not-allowed">
                    Repay
                  </AnimatedButton>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      {/* Empty State */}
      {sortedInvoices.length === 0 && (
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
      )}{" "}
      {/* Repay Modal */}
      {repayModal.data && (
        <RepayModal
          isOpen={repayModal.isOpen}
          onClose={() => setRepayModal({ isOpen: false })}
          data={repayModal.data}
          onRepaySuccess={handleRepaySuccess}
        />
      )}
    </motion.div>
  );
}
