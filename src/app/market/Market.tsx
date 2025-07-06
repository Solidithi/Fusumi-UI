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

const ITEMS_PER_PAGE = 15; // 3 rows x 4 columns for offers
const SERVICES_PER_PAGE = 10; // 10 services per page

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

  const handleShowMoreOffers = () => {
    setLoading(true);
    setTimeout(() => {
      setDisplayedOfferCount((prev) =>
        Math.min(prev + ITEMS_PER_PAGE, filteredOffers.length)
      );
      setLoading(false);
    }, 800);
  };

  const handleShowMoreServices = () => {
    setLoading(true);
    setTimeout(() => {
      setDisplayedServiceCount((prev) =>
        Math.min(prev + SERVICES_PER_PAGE, filteredServices.length)
      );
      setLoading(false);
    }, 800);
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

  const images: Image[] = [
    {
      src: "https://i.pinimg.com/736x/2e/3d/68/2e3d6845011de0d24c13dd1e1028a2ff.jpg",
      alt: "Beautiful Landscape 1",
      // description: 'Description 01',
    },
    {
      src: "https://i.pinimg.com/474x/05/6d/d3/056dd39fccee614d4e46d77ef8814bf8.jpg",
      alt: "Beautiful Landscape 2",
      // description: 'Description 02',
    },
    {
      src: "https://i.pinimg.com/474x/ef/78/99/ef7899d792526a5d10f33c30ad250617.jpg",
      alt: "Beautiful Landscape 3",
      // description: 'Description 03',
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
            <CarouselWithProgress images={images} />
          </motion.div>
        </motion.div>

        <div className="flex md:flex-row md:items-center md:justify-between mb-8">
          <MarketplaceTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
          />
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
              //   <OfferGrid
              //     offers={filteredOffers}
              //     displayedCount={displayedOfferCount}
              //     totalCount={filteredOffers.length}
              //     onShowMore={handleShowMoreOffers}
              //     loading={loading}
              //   />
              <NFTGrid
                nfts={filteredOffers}
                displayedCount={displayedOfferCount}
                totalCount={filteredOffers.length}
                onShowMore={handleShowMoreOffers}
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
            <ServiceList
              services={filteredServices}
              displayedCount={displayedServiceCount}
              totalCount={filteredServices.length}
              onShowMore={handleShowMoreServices}
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
                No services found
              </h3>
              <p className="text-gray-600">Try adjusting your search terms</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
