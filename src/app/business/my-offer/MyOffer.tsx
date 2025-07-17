"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import type { OfferDatas } from "@/types/offer";
import { OffersGrid } from "../../../components/offer/OfferGrid";
import { OffersHeader } from "../../../components/offer/OfferHeader";
import { OfferDetailModal } from "@/components/ui/modal/OfferDetailModal";
import { Sidebar } from "@/components/ui/SideBar";
import offersData from "@/../public/data/offers.json";

export function OffersContent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState<OfferDatas | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Add sidebar state

  // Map offersData to match OfferDatas type
  const normalizedOffers = useMemo(() => {
    return offersData.map((offer: any) => ({
      ...offer,
      invoiceId: offer.invoiceAddress || offer.invoiceId || "",
      status: offer.status || "open", // default status
      updatedAt: offer.updatedAt || offer.createdAt || new Date().toISOString(),
    }));
  }, []);

  const filteredOffers = useMemo(() => {
    return normalizedOffers.filter((offer: any) => {
      const matchesSearch =
        offer.contactInfo?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        offer.contactInfo?.company
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        offer.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || offer.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter, normalizedOffers]);

  const handleView = (offer: OfferDatas) => {
    setSelectedOffer(offer);
    setShowDetailModal(true);
  };

  const handleEdit = (offer: OfferDatas) => {
    console.log("Edit offer:", offer);
    // Navigate to edit page
    router.push(`/offers/edit/${offer.id}`);
  };

  const handleDelete = (offerId: string) => {
    console.log("Delete offer:", offerId);
    // Show confirmation dialog and delete
    if (confirm("Are you sure you want to delete this offer?")) {
      // Delete logic here
      alert("Offer deleted successfully!");
    }
  };

  const handleCreateNew = () => {
    router.push("/business/create-offers");
  };

  const handleCloseModal = () => {
    setShowDetailModal(false);
    setSelectedOffer(null);
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <Sidebar
        isExpanded={sidebarExpanded}
        onToggle={() => setSidebarExpanded(!sidebarExpanded)}
        activePage="offer" // Set active page to "home" for dashboard
      />
      <div className="w-full">
        <motion.div
          className="min-h-screen  bg-gray-50 py-8 px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="max-w-7xl mx-auto">
            <OffersHeader
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              totalCount={filteredOffers.length}
              onCreateNew={handleCreateNew}
            />

            <OffersGrid
              offers={filteredOffers}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>
        </motion.div>

        {/* Offer Detail Modal */}
        {selectedOffer && (
          <OfferDetailModal
            isOpen={showDetailModal}
            onClose={handleCloseModal}
            offer={selectedOffer}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  );
}
