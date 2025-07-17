"use client";

import { StatsCards } from "@/components/dashboard/StatCards";
import { FilterTabs } from "@/components/shared/FilterTab";
import { InvoiceTable } from "@/components/shared/InvoiceTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { Sidebar } from "@/components/ui/SideBar";
import { PaidStatus } from "@/types/project";
import { useEnhancedInvoiceData } from "@/hooks/useEnhancedInvoiceData";
import { calculateDashboardStats } from "@/utils/dashboardStats";
import { motion } from "framer-motion";
import { useState, useMemo, useEffect } from "react";

export function DashboardContent() {
  const [activeFilter, setActiveFilter] = useState<PaidStatus>(PaidStatus.PAID);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  const { enhancedInvoices, loading, error } = useEnhancedInvoiceData();

  // Calculate dashboard stats from enhanced invoices
  const dashboardStats = useMemo(() => {
    return calculateDashboardStats(enhancedInvoices);
  }, [enhancedInvoices]);

  // Debug logging (can be removed in production)
  useEffect(() => {
    if (enhancedInvoices.length > 0) {
      console.log("✅ Enhanced invoices loaded:", enhancedInvoices.length);
      console.log("📊 Dashboard stats:", dashboardStats);
    }
  }, [enhancedInvoices, dashboardStats]);

  const filteredInvoices = useMemo(() => {
    if (!enhancedInvoices.length) return [];

    return enhancedInvoices.filter((invoice) => {
      const statusFilter =
        activeFilter === PaidStatus.TOTAL ||
        (activeFilter === PaidStatus.PAID && invoice.paidStatus === "PAID") ||
        (activeFilter === PaidStatus.UNPAID &&
          invoice.paidStatus === "UNPAID") ||
        (activeFilter === PaidStatus.OVERDUE &&
          invoice.paidStatus === "OVERDUE") ||
        (activeFilter === PaidStatus.PENDING &&
          invoice.paidStatus === "PENDING");

      const searchFilter =
        searchTerm === "" ||
        invoice.ownerAlias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.ownerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.debtorAlias?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.debtorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        invoice.businessName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        invoice.description?.toLowerCase().includes(searchTerm.toLowerCase());

      return statusFilter && searchFilter;
    });
  }, [enhancedInvoices, activeFilter, searchTerm]);

  if (error) {
    return (
      <div className="min-h-screen bg-white flex">
        <Sidebar
          isExpanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded(!sidebarExpanded)}
          activePage="home"
        />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">
              Error Loading Data
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="home"
      />

      {/* Main Content */}
      <div className="flex-1">
        <motion.div
          className="min-h-screen bg-gray-100 py-8 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto">
            <PageHeader
              title="Dashboard Overview"
              subtitle="Welcome back! Here's what's happening with your business today."
              isBusiness={true}
            />
            <StatsCards stats={dashboardStats} />

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
                placeholder="Search invoices by name, business, or description..."
              />
            </motion.div>

            {/* Enhanced Invoice Table */}
            {loading ? (
              <motion.div
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="inline-flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  <span className="text-gray-600">Loading invoice data...</span>
                </div>
              </motion.div>
            ) : (
              <InvoiceTable invoices={filteredInvoices} />
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
