"use client";

import { BusinessSection } from "@/components/sections/BusinessSection";
import { TrendingBusinessSection } from "@/components/sections/TrendingBusinessSection";
import { TrendingProductsSection } from "@/components/sections/TrendingProductsSection";
import CarouselWithProgress, { type Image } from "@/components/shared/Carousel";
import { SearchBar } from "@/components/shared/SearchBar";
import { ReviewModal } from "@/components/ui/modal/ReviewModal";
import { ServiceDetailModal } from "@/components/ui/modal/ServiceDetailModal";
import {
  ProductFilters,
  type FilterState,
} from "@/components/ui/ProductFilter";
import { mockBusinesses } from "@/lib/data";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useMemo, useState, useEffect, useRef, useCallback } from "react";

const carouselImages: Image[] = [
  {
    src: "https://www.cdac.in/img/int-banner/pro-service.jpg",
    alt: "Featured Products 1",
  },
  {
    src: "https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg",
    alt: "Featured Products 2",
  },
  {
    src: "https://media.istockphoto.com/id/1552781935/photo/water-bottles-on-an-automated-conveyor-belt.jpg?s=612x612&w=0&k=20&c=vjYAdVl-LiRa5BxlAJPzWPr2uix1Ui8bzZdCvTAg1zE=",
    alt: "Featured Products 3",
  },
];

export default function AllProductsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    type: [],
    category: [],
    priceRange: [0, 1000],
    rating: 0,
  });
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [reviewModal, setReviewModal] = useState<{
    isOpen: boolean;
    productId: string;
    productName: string;
  }>({
    isOpen: false,
    productId: "",
    productName: "",
  });

  // Add state for the detail modal:
  const [detailModal, setDetailModal] = useState<{
    isOpen: boolean;
    product: any;
  }>({
    isOpen: false,
    product: null,
  });

  // Infinite scroll states
  const [displayedBusinessCount, setDisplayedBusinessCount] = useState(3); // Start with 3 businesses
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);
  
  // Track which businesses should animate (only new ones)
  const [shouldAnimateMap, setShouldAnimateMap] = useState<Map<string, boolean>>(new Map());

  // Mock reviews data
  const [reviews] = useState([
    {
      id: "1",
      user: "John Doe",
      rating: 5,
      comment: "Excellent product! Highly recommended.",
      date: "2024-01-15",
    },
    {
      id: "2",
      user: "Jane Smith",
      rating: 4,
      comment: "Good quality, fast delivery.",
      date: "2024-01-10",
    },
  ]);

  const filteredBusinesses = useMemo(() => {
    return mockBusinesses
      .map((business) => ({
        ...business,
        trending: business.trending.filter((product) =>
          matchesFilters(product, searchTerm, filters)
        ),
        bestSellers: business.bestSellers.filter((product) =>
          matchesFilters(product, searchTerm, filters)
        ),
        goods: business.goods.filter((product) =>
          matchesFilters(product, searchTerm, filters)
        ),
        services: business.services.filter((product) =>
          matchesFilters(product, searchTerm, filters)
        ),
      }))
      .filter(
        (business) =>
          business.trending.length > 0 ||
          business.bestSellers.length > 0 ||
          business.goods.length > 0 ||
          business.services.length > 0
      );
  }, [searchTerm, filters]);

  // Load more businesses function
  const loadMoreBusinesses = useCallback(() => {
    if (loading) return;
    setLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const newCount = Math.min(displayedBusinessCount + 3, filteredBusinesses.length);
      setDisplayedBusinessCount(newCount);
      setLoading(false);
    }, 800);
  }, [loading, displayedBusinessCount, filteredBusinesses]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedBusinessCount(3);
    setShouldAnimateMap(new Map()); // Reset animation tracking
  }, [searchTerm, filters]);

  // Track new businesses to animate only newly loaded ones
  useEffect(() => {
    const currentBusinesses = filteredBusinesses.slice(0, displayedBusinessCount);
    setShouldAnimateMap(prev => {
      const newMap = new Map(prev);
      
      currentBusinesses.forEach((business, index) => {
        if (!newMap.has(business.id)) {
          // Mark new businesses for animation
          newMap.set(business.id, true);
        }
      });
      
      return newMap;
    });
  }, [displayedBusinessCount, filteredBusinesses]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          displayedBusinessCount < filteredBusinesses.length &&
          !loading
        ) {
          loadMoreBusinesses();
        }
      },
      { threshold: 0.1 }
    );

    const currentRef = loadingRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [
    displayedBusinessCount,
    filteredBusinesses.length,
    loading,
    loadMoreBusinesses,
  ]);

  // Get trending businesses (top businesses by average product rating)
  const trendingBusinesses = useMemo(() => {
    return mockBusinesses
      .map((business) => {
        const allProducts = [
          ...business.trending,
          ...business.bestSellers,
          ...business.goods,
          ...business.services,
        ];
        const avgRating =
          allProducts.length > 0
            ? allProducts.reduce((sum, product) => sum + product.rating, 0) /
              allProducts.length
            : 0;
        const totalReviews = allProducts.reduce(
          (sum, product) => sum + product.reviews,
          0
        );

        return {
          ...business,
          rating: avgRating,
          totalReviews: totalReviews,
        };
      })
      .filter(
        (business) => business.rating >= 4.5 && business.totalReviews >= 50
      )
      .sort((a, b) => b.rating * b.totalReviews - a.rating * a.totalReviews)
      .slice(0, 12); // Top 12 trending businesses
  }, []);

  // Get all trending products across all businesses
  const trendingProducts = useMemo(() => {
    const allTrendingProducts: any[] = [];

    mockBusinesses.forEach((business) => {
      // Add trending products
      business.trending.forEach((product) => {
        allTrendingProducts.push({
          ...product,
          business: business.name,
          type: "goods" as const,
          sales: Math.floor(Math.random() * 1000) + 100, // Mock sales data
        });
      });

      // Add some best sellers as trending too
      business.bestSellers.slice(0, 2).forEach((product) => {
        allTrendingProducts.push({
          ...product,
          business: business.name,
          type: "goods" as const,
          sales: Math.floor(Math.random() * 1000) + 100,
        });
      });
    });

    // Sort by rating and return top 16
    return allTrendingProducts.sort((a, b) => b.rating - a.rating).slice(0, 16);
  }, []);

  const handleFavoriteToggle = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      return newFavorites;
    });
  };

  // Update handleViewDetails:
  const handleViewDetails = (productId: string) => {
    const product = findProductById(productId);
    if (product) {
      setDetailModal({
        isOpen: true,
        product: {
          ...product,
          isFavorite: favorites.has(productId),
        },
      });
    }
  };

  // Add handleAddToCart:
  const handleAddToCart = (productId: string) => {
    console.log("Added to cart:", productId);
    // Implement cart functionality
    setDetailModal({ ...detailModal, isOpen: false });
  };

  const handleSubmitReview = (rating: number, comment: string) => {
    // Handle review submission
    console.log("New review:", {
      rating,
      comment,
      productId: reviewModal.productId,
    });
    setReviewModal({ ...reviewModal, isOpen: false });
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
        ease: [0.6, -0.05, 0.01, 0.99],
      },
    },
  };

  return (
    <motion.div
      className="min-h-screen bg-gray-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Header */}
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
            All Products
          </motion.h1>
          <motion.p
            className="text-gray-600 max-w-2xl mx-auto"
            variants={itemVariants as any}
          >
            Discover amazing products and services from our trusted business
            partners. Find exactly what you&apos;re looking for with our
            advanced search and filtering options.
          </motion.p>
        </motion.div>
      </div>

      {/* Hero Carousel */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        whileHover={{ scale: 1.02 }}
      >
        <CarouselWithProgress images={carouselImages} />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        {/* Search and Filters */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 mb-8 items-start md:items-center md:justify-end"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="md:max-w-md">
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              placeholder="Search products, businesses, or categories..."
            />
          </div>
          <ProductFilters activeFilters={filters} onFilterChange={setFilters} />
        </motion.div>

        {/* Trending Businesses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <TrendingBusinessSection
            businesses={trendingBusinesses}
            onFavoriteToggle={handleFavoriteToggle}
            onViewDetails={handleViewDetails}
          />
        </motion.div>

        {/* Trending Products Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <TrendingProductsSection
            products={trendingProducts}
            onFavoriteToggle={handleFavoriteToggle}
            onViewDetails={handleViewDetails}
          />
        </motion.div>

        {/* Business Sections */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12"
        >
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Building2 className="h-8 w-8 text-[#3587A3]" />
              <h2 className="text-3xl font-bold text-gray-900">
                All Businesses
              </h2>
            </div>
            <p className="text-gray-600">
              Browse products and services from all our partners
            </p>
          </div>
        </motion.div>

        {/* Business Sections List */}
        <div className="space-y-8">
          {filteredBusinesses.length > 0 ? (
            <>
              {filteredBusinesses
                .slice(0, displayedBusinessCount)
                .map((business, index) => {
                  // Check if this business should animate (first time being rendered)
                  const shouldAnimate = shouldAnimateMap.get(business.id) === true;
                  
                  return (
                    <motion.div 
                      key={`business-${business.id}`}
                      initial={shouldAnimate ? { opacity: 0, y: 30 } : { opacity: 1, y: 0 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.6, -0.05, 0.01, 0.99],
                        delay: shouldAnimate ? (index % 3) * 0.1 : 0, // Stagger animation for new items
                      }}
                      onAnimationComplete={() => {
                        // Mark as animated to prevent re-animation
                        setShouldAnimateMap(prev => {
                          const newMap = new Map(prev);
                          newMap.set(business.id, false);
                          return newMap;
                        });
                      }}
                    >
                      <BusinessSection
                        business={business}
                        onFavoriteToggle={handleFavoriteToggle}
                        onViewDetails={handleViewDetails}
                        shouldAnimate={shouldAnimate}
                      />
                    </motion.div>
                  );
                })}

              {/* Loading indicator and intersection observer trigger */}
              {displayedBusinessCount < filteredBusinesses.length && (
                <div ref={loadingRef} className="flex justify-center mt-8 py-4">
                  {loading ? (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#2a849a]"></div>
                      <span>Loading more businesses...</span>
                    </div>
                  ) : (
                    <div className="h-4"></div>
                  )}
                </div>
              )}
            </>
          ) : (
            <motion.div
              className="text-center py-16"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.6, -0.05, 0.01, 0.99] }}
            >
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No products found
              </h3>
              <p className="text-gray-600">
                Try adjusting your search terms or filters
              </p>
            </motion.div>
          )}
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        isOpen={reviewModal.isOpen}
        onClose={() => setReviewModal({ ...reviewModal, isOpen: false })}
        productName={reviewModal.productName}
        reviews={reviews}
        onSubmitReview={handleSubmitReview}
      />

      {/* Service Detail Modal */}
      <ServiceDetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ ...detailModal, isOpen: false })}
        serviceData={convertProductToServiceData(detailModal.product)}
        reviews={reviews}
        onFavoriteToggle={handleFavoriteToggle}
        onSubmitReview={handleSubmitReview}
      />
    </motion.div>
  );
}

// Helper functions
function matchesFilters(
  product: any,
  searchTerm: string,
  filters: FilterState
): boolean {
  // Search term filter
  if (searchTerm) {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch =
      product.name.toLowerCase().includes(searchLower) ||
      product.business.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower);

    if (!matchesSearch) return false;
  }

  // Type filter
  if (filters.type.length > 0 && !filters.type.includes(product.type)) {
    return false;
  }

  // Category filter
  if (
    filters.category.length > 0 &&
    !filters.category.includes(product.category)
  ) {
    return false;
  }

  // Rating filter
  if (filters.rating > 0 && product.rating < filters.rating) {
    return false;
  }

  // Price range filter
  if (
    product.price < filters.priceRange[0] ||
    product.price > filters.priceRange[1]
  ) {
    return false;
  }

  return true;
}

function findProductById(productId: string): any {
  for (const business of mockBusinesses) {
    const allProducts = [
      ...business.trending,
      ...business.bestSellers,
      ...business.goods,
      ...business.services,
    ];
    const product = allProducts.find((p) => p.id === productId);
    if (product) return product;
  }
  return null;
}

// Convert product data to service data format for ServiceDetailModal
function convertProductToServiceData(product: any): any {
  if (!product) return null;

  return {
    id: product.id,
    serviceName: product.name,
    businessName: product.business,
    description:
      product.description ||
      `Experience our premium ${product.name} service. Quality guaranteed with excellent customer support.`,
    startDate: new Date().toLocaleDateString(),
    endDate: new Date(
      Date.now() + 30 * 24 * 60 * 60 * 1000
    ).toLocaleDateString(), // 30 days from now
    price: product.price,
    features: [
      "High-quality service delivery",
      "24/7 customer support",
      "Satisfaction guarantee",
      "Professional expertise",
      "Timely completion",
    ],
    image: product.image,
  };
}
