"use client";

import { motion } from "framer-motion";
import { useState, useMemo } from "react";
import type {
  EnhancedInvoiceData,
  InvoiceSortConfig,
  SortDirection,
} from "@/types/dashboard";
import {
  sortInvoices,
  getFullAddressInfo,
  getStatusBadgeColor,
  formatCurrency,
  formatDate,
} from "@/utils/invoiceUtils";

// Simple SVG Icons
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

interface InvoiceTableProps {
  invoices: EnhancedInvoiceData[];
}

export function InvoiceTable({ invoices }: InvoiceTableProps) {
  const [sortConfig, setSortConfig] = useState<InvoiceSortConfig>({
    field: "createdAt",
    direction: "desc",
  });

  const [debtorTypeFilter, setDebtorTypeFilter] = useState<
    "all" | "business" | "customer"
  >("all");

  // Filter and sort invoices
  const processedInvoices = useMemo(() => {
    const filtered = invoices.filter((invoice) => {
      if (debtorTypeFilter === "all") return true;
      return invoice.debtorType === debtorTypeFilter;
    });
    return sortInvoices(filtered, sortConfig);
  }, [invoices, sortConfig, debtorTypeFilter]);

  const handleSort = (field: InvoiceSortConfig["field"]) => {
    setSortConfig((prev) => ({
      field,
      direction:
        prev.field === field && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (field: InvoiceSortConfig["field"]) => {
    if (sortConfig.field !== field) {
      return <ChevronUpIcon className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUpIcon className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDownIcon className="w-4 h-4 text-blue-600" />
    );
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
    { key: "NFT Holder", label: "Address Owner", sortable: false },
    { key: "addressDebtor", label: "Debtor", sortable: false },
    { key: "unitDebt", label: "Debt Amount", sortable: true },
    { key: "endIn", label: "Payment Due", sortable: true },
    { key: "fieldCompany", label: "Field Company" },
  ];

  return (
    <motion.div
      className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      {/* Debtor Filter Section */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">
              Filter Debtor Type:
            </span>
            <select
              value={debtorTypeFilter}
              onChange={(e) => setDebtorTypeFilter(e.target.value as any)}
              className="px-3 py-2 text-black border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            >
              <option value="all">All Types</option>
              <option value="business">Businesses</option>
              <option value="customer">Customers</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            {processedInvoices.length} invoice
            {processedInvoices.length !== 1 ? "s" : ""}
          </div>
        </div>
      </div>

      {/* Table Header */}
      <div className="bg-[#F8EDE2] px-6 py-4">
        <div className="grid grid-cols-6 gap-4">
          {columns.map((column) => (
            <motion.div
              key={column.key}
              className={`text-sm font-medium text-[#445E6D] flex items-center ${
                column.sortable ? "cursor-pointer hover:text-blue-600" : ""
              }`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              onClick={() => column.sortable && handleSort(column.key as any)}
            >
              <span>{column.label}</span>
              {column.sortable && (
                <span className="ml-1">{getSortIcon(column.key as any)}</span>
              )}
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
        {processedInvoices.map(
          (invoice: EnhancedInvoiceData, index: number) => {
            const ownerInfo = getFullAddressInfo(
              invoice.ownerAddress,
              invoice.ownerAlias,
              invoice.ownerName,
              invoice.ownerType
            );

            const debtorInfo = getFullAddressInfo(
              invoice.debtorAddress,
              invoice.debtorAlias,
              invoice.debtorName,
              invoice.debtorType
            );

            const statusColors = getStatusBadgeColor(invoice.paidStatus);

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

                  {/* Debtor */}
                  <div className="flex flex-col">
                    <span
                      className="text-sm font-medium text-gray-900 truncate"
                      title={debtorInfo.title}
                    >
                      {debtorInfo.display}
                    </span>
                    {debtorInfo.type && (
                      <span
                        className={`text-xs font-medium capitalize ${
                          debtorInfo.type === "business"
                            ? "text-blue-600"
                            : "text-green-600"
                        }`}
                      >
                        {debtorInfo.type}
                      </span>
                    )}
                  </div>

                  {/* Value */}
                  <div className="text-sm text-gray-900 font-semibold">
                    {formatCurrency(invoice.totalValue || 0)}
                  </div>

                  {/* Created Date */}
                  <div className="text-sm text-gray-600">
                    {formatDate(invoice.createdAt)}
                  </div>

                  {/* Due Date */}
                  <div className="text-sm text-gray-600">
                    {formatDate(invoice.endDate)}
                  </div>

                  {/* Status */}
                  <div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors.bg} ${statusColors.text}`}
                    >
                      {invoice.paidStatus}
                    </span>
                  </div>
                </div>
              </motion.div>
            );
          }
        )}
      </motion.div>

      {/* Empty State */}
      {processedInvoices.length === 0 && (
        <motion.div
          className="px-6 py-12 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500">
            No invoices found matching your criteria.
          </p>
          {debtorTypeFilter !== "all" && (
            <button
              onClick={() => setDebtorTypeFilter("all")}
              className="mt-2 text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Clear filter
            </button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}
