"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
// import { MarketplaceTabs } from "./marketplace-tabs";
// import { OfferGrid } from "./offer-grid";
import NextImage from "next/image";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterTabs } from "@/components/shared/FilterTab";
import { MarketplaceTabs } from "@/components/market/MarketTabs";
import { MarketplaceTab } from "@/types/market";
import { mockNFTData, mockOfferData, mockServiceData } from "@/lib/data";
import { NFTGrid } from "@/components/nft/NFTGrid";
import { ServiceList } from "@/components/market/ServiceList";
import CarouselWithProgress, { Image } from "@/components/shared/Carousel";

const ITEMS_PER_PAGE = 8; // Changed to 8 items per load
const SERVICES_PER_PAGE = 8; // Changed to 8 services per page

export function MarketplaceContent() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>("offer");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedOfferCount, setDisplayedOfferCount] =
    useState(ITEMS_PER_PAGE);
  const [displayedServiceCount, setDisplayedServiceCount] =
    useState(SERVICES_PER_PAGE);
  const [loading, setLoading] = useState(false);

  const filteredOffers = useMemo(() => {
    return mockNFTData.filter(
      (offer: any) =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const filteredServices = useMemo(() => {
    return mockServiceData.filter(
      (service: any) =>
        service.businessName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const handleLoadMoreOffers = () => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setDisplayedOfferCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, filteredOffers.length)
      );
      setLoading(false);
    }, 300);
  };

  const handleLoadMoreServices = () => {
    if (loading) return;

    setLoading(true);
    setTimeout(() => {
      setDisplayedServiceCount((prev) =>
        Math.min(prev + SERVICES_PER_PAGE, filteredServices.length)
      );
      setLoading(false);
    }, 300);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setDisplayedOfferCount(ITEMS_PER_PAGE);
    setDisplayedServiceCount(SERVICES_PER_PAGE);
  };

  const handleTabChange = (tab: MarketplaceTab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setDisplayedOfferCount(ITEMS_PER_PAGE);
    setDisplayedServiceCount(SERVICES_PER_PAGE);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut",
      },
    },
  };

  const carouselImages: Image[] = [
    {
      src: "https://cdna.artstation.com/p/assets/images/images/046/943/386/large/enrique-sepulveda-orcs-must-die-hero-banner-redes.jpg?1646349349",
      alt: "Featured Products 1",
    },
    {
      src: "https://sdmntprwestus.oaiusercontent.com/files/00000000-f36c-6230-b1ed-903e910717e4/raw?se=2025-07-16T09%3A15%3A52Z&sp=r&sv=2024-08-04&sr=b&scid=38b9bd4c-d087-5ddc-9d00-7f4ce32da87f&skoid=61180a4f-34a9-42b7-b76d-9ca47d89946d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-07-16T07%3A33%3A07Z&ske=2025-07-17T07%3A33%3A07Z&sks=b&skv=2024-08-04&sig=zBi8m%2B6Hggjbs4fZs85kaKksoiwDDkOAaPZ2Z08xocw%3D",
      alt: "Featured Products 2",
    },
    {
      src: "https://cointelegraph.com/magazine/wp-content/uploads/2021/12/magazine-CryptoNova.jpg",
      alt: "Featured Products 3",
    },
  ];

  return (
    <motion.div
      className="min-h-screen bg-gray-50 py-8 px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            variants={itemVariants as any}
          >
            Marketplace
          </motion.h1>

          <motion.p
            className="text-gray-600 max-w-4xl mx-auto mb-8 leading-relaxed"
            variants={itemVariants as any}
          >
            Discover exclusive offers and curated services designed to elevate
            your NFT journey. From seamless minting to secure trading, we make
            every step simple and transparent. Unlock new opportunities and
            connect with creators and collectors worldwide.
          </motion.p>

          {/* Hero Banner */}
          <motion.div
            className="relative w-full"
            variants={itemVariants as any}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            {/* <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lYmmjSZAbS3GTaHKdhjr2G5OhMBRrf.png"
              alt="Marketplace Hero"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" /> */}
            <CarouselWithProgress images={carouselImages} />
          </motion.div>
        </motion.div>

        <div className="flex md:flex-row md:items-center md:justify-end mb-8">
          {/* <MarketplaceTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          /> */}
          {/* <MarketplaceSearch
            searchTerm={searchTerm}
            onSearchChange={handleSearchChange}
            placeholder={
              activeTab === "offer" ? "Search offers..." : "Search services..."
            }
          /> */}
          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            placeholder={
              activeTab === "offer" ? "Search offers..." : "Search services..."
            }
          />
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {activeTab === "offer" ? (
            filteredOffers.length > 0 ? (
              <NFTGrid
                nfts={filteredOffers}
                displayedCount={displayedOfferCount}
                totalCount={filteredOffers.length}
                onLoadMore={handleLoadMoreOffers}
                loading={loading}
              />
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No offers found
                </h3>
                <p className="text-gray-600">Try adjusting your search terms</p>
              </motion.div>
            )
          ) : filteredServices.length > 0 ? (
            // <ServiceList
            //   services={filteredServices}
            //   displayedCount={displayedServiceCount}
            //   totalCount={filteredServices.length}
            //   onLoadMore={handleLoadMoreServices}
            //   loading={loading}
            // />
            <div className="">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No offers found
              </h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          ) : (
            // <div className="">
            //   <div className="text-gray-400 text-6xl mb-4">🔍</div>
            //   <h3 className="text-xl font-semibold text-gray-900 mb-2">
            //     No offers found
            //   </h3>
            //   <p className="text-gray-600">Try adjusting your search terms</p>
            // </div>
            <div className="">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No offers found
              </h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
