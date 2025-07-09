"use client";
import { FilterTabs } from "@/components/shared/FilterTab";
import { InvoiceTable } from "@/components/shared/InvoiceTable";
import { PageHeader } from "@/components/shared/PageHeader";
import { SearchBar } from "@/components/shared/SearchBar";
import { Sidebar } from "@/components/ui/SideBar";
import { mockInvoiceData } from "@/lib/data";
import { FilterType } from "@/types/dashboard";
import { motion } from "framer-motion";
import { useState } from "react";

export function MyInvoices() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("paid");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Add sidebar state

  const filteredInvoices = mockInvoiceData.filter((invoice: any) => {
    const matchesFilter =
      activeFilter === "total" || invoice.status === activeFilter;
    const matchesSearch =
      invoice.addressOwner.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.addressDebtor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.fieldCompany.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="my-invoices" // Set active page to "home" for dashboard
        type="customers"
      />
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
              />
            </motion.div>

            <InvoiceTable invoices={filteredInvoices} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
