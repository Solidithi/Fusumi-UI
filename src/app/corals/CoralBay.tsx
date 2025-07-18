"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { SearchBar } from "@/components/shared/SearchBar";
import { FilterTabs } from "@/components/shared/FilterTab";
import { MarketplaceTab } from "@/types/market";
import { CoralGrid } from "@/components/coral/CoralGrid";
import CarouselWithProgress, { Image } from "@/components/shared/Carousel";
import { Coral } from "@/types/coral";
import corals from "@/../public/data/corals.json";

const ITEMS_PER_PAGE = 8; // Changed to 8 items per load
const SERVICES_PER_PAGE = 8; // Changed to 8 services per page

export function MarketplaceContent() {
  const [activeTab, setActiveTab] = useState<MarketplaceTab>("offer");
  const [searchTerm, setSearchTerm] = useState("");
  const [displayedOfferCount, setDisplayedOfferCount] =
    useState(ITEMS_PER_PAGE);
  useState(SERVICES_PER_PAGE);
  const [loading, setLoading] = useState(false);
  const [offers, setOffers] = useState<Coral[]>([]);

  // Load offers data on component mount
  const loadOffersData = async () => {
    try {
      // const response = await fetch("/data/corals.json");
      // const offersData = await response.json();
      setOffers(corals);
    } catch (error) {
      console.error("Error loading offers data:", error);
    }
  };

  // Load data on mount
  useMemo(() => {
    loadOffersData();
  }, []);

  const filteredOffers = useMemo(() => {
    return offers.filter(
      (offer: Coral) =>
        offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.sellerId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offer.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, offers]);

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

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setDisplayedOfferCount(ITEMS_PER_PAGE);
  };

  const handleTabChange = (tab: MarketplaceTab) => {
    setActiveTab(tab);
    setSearchTerm("");
    setDisplayedOfferCount(ITEMS_PER_PAGE);
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
      src: "https://w0.peakpx.com/wallpaper/171/126/HD-wallpaper-the-great-wave-off-kanagawa-sunrise-artist-artwork-digital-art.jpg",
      alt: "Featured Image 1",
    },
    {
      src: "https://www.stash-co.com/cdn/shop/products/55b051df3e88c8321d267531d9e09b09db8e067879efe20e42ba83215e8c1bab.jpg?v=1674759533",
      alt: "Featured Image 2",
    },
    {
      src: "https://cdna.artstation.com/p/assets/images/images/046/943/386/large/enrique-sepulveda-orcs-must-die-hero-banner-redes.jpg?1646349349",
      alt: "Featured Image 3",
    },
    {
      src: "https://cointelegraph.com/magazine/wp-content/uploads/2021/12/magazine-CryptoNova.jpg",
      alt: "Featured Image 4",
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
            Step into Fusumi&apos;s vibrant coral bay—where NFT discovery meets
            playful innovation. Explore handpicked offers and creative services,
            all designed to make your Fusumi journey seamless, social, and fun.
            Mint, trade, and connect with a global community of collectors and
            creators, all in the Fusumi spirit.
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
          {filteredOffers.length > 0 ? (
            <CoralGrid
              coralOffers={filteredOffers}
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
          )}
        </motion.div>
      </div>
    </motion.div>
  );
}
