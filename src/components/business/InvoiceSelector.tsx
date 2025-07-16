"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/ButtonBussiness";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { motion } from "framer-motion";
import {
  Search,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface Invoice {
  id: string;
  ownerAddress: string;
  debtorAddress: string;
  description: string;
  paidStatus: "PENDING" | "PAID" | "OVERDUE";
  startDate: string;
  endDate: string;
  attachments: string[];
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

interface InvoiceSelectorProps {
  selectedInvoiceId: string;
  onInvoiceSelect: (invoiceId: string) => void;
  businessId: string;
}

const statusColors = {
  PENDING: "bg-yellow-100 text-yellow-800",
  PAID: "bg-green-100 text-green-800",
  OVERDUE: "bg-red-100 text-red-800",
};

const statusIcons = {
  PENDING: Clock,
  PAID: CheckCircle,
  OVERDUE: XCircle,
};

export function InvoiceSelector({
  selectedInvoiceId,
  onInvoiceSelect,
  businessId,
}: InvoiceSelectorProps) {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = invoices.filter(
        (invoice) =>
          invoice.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          invoice.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredInvoices(filtered);
    } else {
      setFilteredInvoices(invoices);
    }
  }, [searchTerm, invoices]);

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/data/invoices.json");
      const data = await response.json();

      // Filter invoices for the current business and active status
      const businessInvoices = data.invoices.filter(
        (invoice: Invoice) =>
          invoice.businessId === businessId &&
          (invoice.paidStatus === "PENDING" || invoice.paidStatus === "OVERDUE")
      );

      setInvoices(businessInvoices);
      setFilteredInvoices(businessInvoices);
    } catch (error) {
      console.error("Failed to fetch invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInvoiceSelect = (invoiceId: string) => {
    onInvoiceSelect(invoiceId);
    setIsOpen(false);
  };

  const selectedInvoice = invoices.find((inv) => inv.id === selectedInvoiceId);

  return (
    <div className="relative">
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-white/90">
          Select Invoice
        </Label>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search by invoice ID or description..."
            className="bg-white/90 border-white/30 focus:border-white focus:ring-white/50 text-gray-700 transition-all duration-300 pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsOpen(true)}
          />
        </div>

        {/* Selected Invoice Display */}
        {selectedInvoice && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/10 rounded-lg p-3 border border-white/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FileText className="h-4 w-4 text-white" />
                <span className="text-white font-medium">
                  {selectedInvoice.id}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {(() => {
                  const StatusIcon = statusIcons[selectedInvoice.paidStatus];
                  return (
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[selectedInvoice.paidStatus]
                      }`}
                    >
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {selectedInvoice.paidStatus}
                    </div>
                  );
                })()}
              </div>
            </div>
            <p className="text-white/80 text-sm mt-1 truncate">
              {selectedInvoice.description}
            </p>
            <div className="flex items-center space-x-4 mt-2 text-xs text-white/70">
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(selectedInvoice.startDate).toLocaleDateString()}
                </span>
              </div>
              <span>•</span>
              <div className="flex items-center space-x-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {new Date(selectedInvoice.endDate).toLocaleDateString()}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Dropdown List */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="absolute top-full mt-2 w-full bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-64 overflow-y-auto"
        >
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading invoices...
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              {searchTerm
                ? "No invoices found matching your search"
                : "No active invoices found"}
            </div>
          ) : (
            filteredInvoices.map((invoice) => {
              const StatusIcon = statusIcons[invoice.paidStatus];
              return (
                <motion.div
                  key={invoice.id}
                  whileHover={{ backgroundColor: "#f9fafb" }}
                  className="p-3 cursor-pointer border-b border-gray-100 last:border-b-0"
                  onClick={() => handleInvoiceSelect(invoice.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <span className="font-medium text-gray-900">
                        {invoice.id}
                      </span>
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        statusColors[invoice.paidStatus]
                      }`}
                    >
                      <StatusIcon className="h-3 w-3 inline mr-1" />
                      {invoice.paidStatus}
                    </div>
                  </div>
                  <p className="text-gray-600 text-sm mt-1 truncate">
                    {invoice.description}
                  </p>
                  <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(invoice.startDate).toLocaleDateString()}
                      </span>
                    </div>
                    <span>•</span>
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-3 w-3" />
                      <span>
                        {new Date(invoice.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })
          )}
        </motion.div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
      )}
    </div>
  );
}
