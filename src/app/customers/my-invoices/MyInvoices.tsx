"use client";
import { FilterTabs } from "@/components/shared/FilterTab";
import { CustomerInvoiceTable } from "@/components/shared/CustomerInvoiceTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
// import { mockInvoiceData } from "@/lib/data";
import { FilterType } from "@/types/dashboard";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import axios from "axios";
import { Invoice, PaidStatus } from "@/types/project";
import { useEnhancedInvoiceData } from "@/hooks/useEnhancedInvoiceData";
import type { EnhancedInvoiceData } from "@/types/dashboard";

export function MyInvoices() {
  const [activeFilter, setActiveFilter] = useState<PaidStatus>(PaidStatus.PAID);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const { enhancedInvoices, loading, error } = useEnhancedInvoiceData();

  // Local state to track invoice updates
  const [localInvoices, setLocalInvoices] = useState<EnhancedInvoiceData[]>([]);

  // Update local invoices when enhanced invoices change
  useEffect(() => {
    setLocalInvoices(enhancedInvoices);
  }, [enhancedInvoices]);

  const handleInvoiceUpdate = (invoiceId: string, newStatus: string) => {
    setLocalInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.id === invoiceId
          ? {
              ...invoice,
              paidStatus: newStatus as "PAID" | "PENDING" | "OVERDUE" | "UNPAID",
            }
          : invoice
      )
    );
  };

  const filteredInvoices = localInvoices.filter((invoice) => {
    const matchesFilter =
      activeFilter === PaidStatus.TOTAL || invoice.paidStatus === activeFilter;

    const matchesSearch =
      invoice.ownerAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.debtorAddress.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.ownerAlias &&
        invoice.ownerAlias.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.debtorAlias &&
        invoice.debtorAlias.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.businessName &&
        invoice.businessName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())) ||
      invoice.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (invoice.totalValue &&
        invoice.totalValue.toString().includes(searchTerm)) ||
      (invoice.createdAt &&
        invoice.createdAt.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (invoice.endDate &&
        invoice.endDate.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <div className="w-full">
        <motion.div
          className="min-h-screen bg-gray-100 py-8 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="My Invoices"
              subtitle="Welcome back! Here’s your invoices."
            />
            <motion.div
              className="flex flex-col md:flex-row md:items-center md:justify-between mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                placeholder="Search invoices by owner, debtor, business, amount, or dates..."
              />
            </motion.div>

            <CustomerInvoiceTable
              invoices={filteredInvoices}
              onInvoiceUpdate={handleInvoiceUpdate}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
