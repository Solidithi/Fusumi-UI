"use client";

import { OfferDetailModal } from "@/components/ui/modal/OfferDetailModal";
import { useState, useMemo } from "react";
import { Sidebar } from "@/components/ui/SideBar";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useUser } from "@/app/hooks/useUser";
import type { EnhancedCoral, Coral } from "@/types/coral";
import { OffersGrid } from "../../../components/offer/OfferGrid";
import { OffersHeader } from "../../../components/offer/OfferHeader";
import { toEnhancedCoral } from "@/utils/coralUtils";
import coralsData from "@/../public/data/corals.json";

export function OffersContent() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState<Coral | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true); // Add sidebar state

  const currentUser = useUser();

  const ourOffersEnhanced = useMemo(() => {
    const isUserWorkingForBusiness = currentUser?.belongsToBusiness;
    const results: EnhancedCoral[] = [];

    // For enterprise employee user, filter by user's business ID
    if (isUserWorkingForBusiness) {
      const businessId = currentUser.belongsToBusiness;
      coralsData.forEach((offer: Coral) => {
        if (offer.sellerId === businessId) {
          results.push(toEnhancedCoral(offer));
        }
      });
    } else {
      // For personal offers, filter by user's address (offer's sellerId)
      coralsData.forEach((offer: Coral) => {
        if (offer.sellerId === currentUser?.id) {
          results.push(toEnhancedCoral(offer));
        }
      });
    }

    return results;
  }, [coralsData, currentUser]);

  const filteredOffers = useMemo(() => {
    return ourOffersEnhanced.filter((offer: EnhancedCoral) => {
      const matchesSearch =
        offer.contactInfo?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        offer.contactInfo?.company
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        offer.invoiceId?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus = statusFilter === "all"; // Remove status filter for now since offers don't have status
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const handleView = (offer: Coral) => {
    setSelectedOffer(offer);
    setShowDetailModal(true);
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

            <OffersGrid offers={filteredOffers} onView={handleView} />
          </div>
        </motion.div>

        {/* Offer Detail Modal */}
        {selectedOffer && (
          <OfferDetailModal
            isOpen={showDetailModal}
            onClose={handleCloseModal}
            offer={selectedOffer}
          />
        )}
      </div>
    </div>
  );
}
