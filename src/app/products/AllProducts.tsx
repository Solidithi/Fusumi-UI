"use client";

import { BusinessSection } from "@/components/sections/BusinessSection";
import { TrendingBusinessSection } from "@/components/sections/TrendingBusinessSection";
import { TrendingProductsSection } from "@/components/sections/TrendingProductsSection";
import CarouselWithProgress, { type Image } from "@/components/shared/Carousel";
import { SearchBar } from "@/components/shared/SearchBar";
import { CategorySelect } from "@/components/ui/CategorySelect";
import { ReviewModal } from "@/components/ui/modal/ReviewModal";
import { ServiceDetailModal } from "@/components/ui/modal/ServiceDetailModal";
import {
  ProductFilters,
  type FilterState,
} from "@/components/ui/ProductFilter";
import { motion } from "framer-motion";
import { Building2 } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

// Types based on Prisma schema
interface Business {
  id: string;
  businessName: string;
  registrationNumber: string;
  incorporationDate: string;
  businessType: string;
  officialWebsite?: string;
  businessLogo?: string;
  legalRepFullName: string;
  legalRepId: string;
  legalRepPosition: string;
  legalRepNationality: string;
  taxId: string;
  financialProfile: string[];
  documentUrls: string[];
  description?: string;
  rating?: number;
  totalReviews?: number;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  productName: string;
  productType: "SERVICE" | "PRODUCT";
  price: number;
  unitOfMeasure: string;
  description?: string;
  images: string[];
  startDate: string;
  endDate: string;
  businessId: string;
  category: string;
  rating: number;
  reviews: number;
  sales: number;
  type: "service" | "goods";
  createdAt: string;
  updatedAt: string;
}

interface Service {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  startDate: string;
  endDate: string;
  attachments: string[];
  businessId: string;
  features?: string[];
  createdAt: string;
  updatedAt: string;
}

interface Review {
  id: string;
  productId: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

interface ProductsData {
  businesses: Business[];
  products: Product[];
  services: Service[];
  reviews: Review[];
}

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
  const [selectedCategory, setSelectedCategory] = useState<string>("");
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

  // Data state from JSON file
  const [productsData, setProductsData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Infinite scroll states
  const [displayedBusinessCount, setDisplayedBusinessCount] = useState(3); // Start with 3 businesses
  const [businessLoading, setBusinessLoading] = useState(false);
  const loadingRef = useRef<HTMLDivElement>(null);

  // Track which businesses should animate (only new ones)
  const [shouldAnimateMap, setShouldAnimateMap] = useState<
    Map<string, boolean>
  >(new Map());

  // Load data from API
  useEffect(() => {
    const loadProductsData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to load products data');
        }
        const data: ProductsData = await response.json();
        setProductsData(data);
        
        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem('product-favorites');
        if (savedFavorites) {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadProductsData();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem('product-favorites', JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  // Create business objects with products grouped
  const businesses = useMemo(() => {
    if (!productsData) return [];
    
    return productsData.businesses.map(business => {
      const businessProducts = productsData.products.filter(p => p.businessId === business.id);
      const businessServices = productsData.services.filter(s => s.businessId === business.id);
      
      return {
        ...business,
        name: business.businessName,
        logo: business.businessLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(business.businessName)}&background=3587A3&color=fff&size=64`,
        trending: businessProducts.filter(p => p.rating >= 4.5).slice(0, 3),
        bestSellers: businessProducts.sort((a, b) => b.sales - a.sales).slice(0, 3),
        goods: businessProducts.filter(p => p.type === 'goods'),
        services: businessProducts.filter(p => p.type === 'service').concat(
          businessServices.map(s => ({
            ...s,
            id: s.id,
            name: s.name,
            productName: s.name,
            price: s.price,
            description: s.description,
            image: s.imageUrl || '/placeholder-service.jpg',
            images: s.imageUrl ? [s.imageUrl] : [],
            rating: 4.5, // Default rating for services
            reviews: Math.floor(Math.random() * 100) + 10,
            category: 'Service',
            type: 'service' as const,
            sales: Math.floor(Math.random() * 200) + 50,
            business: business.businessName,
            businessId: s.businessId,
            productType: 'SERVICE' as const,
            unitOfMeasure: 'per service',
            startDate: s.startDate,
            endDate: s.endDate,
            createdAt: s.createdAt,
            updatedAt: s.updatedAt
          }))
        )
      };
    });
  }, [productsData]);

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
    if (!businesses) return [];
    
    return businesses
      .map((business: any) => ({
        ...business,
        trending: business.trending.filter((product: any) =>
          matchesFilters(product, searchTerm, filters, selectedCategory)
        ),
        bestSellers: business.bestSellers.filter((product: any) =>
          matchesFilters(product, searchTerm, filters, selectedCategory)
        ),
        goods: business.goods.filter((product: any) =>
          matchesFilters(product, searchTerm, filters, selectedCategory)
        ),
        services: business.services.filter((product: any) =>
          matchesFilters(product, searchTerm, filters, selectedCategory)
        ),
      }))
      .filter(
        (business: any) =>
          business.trending.length > 0 ||
          business.bestSellers.length > 0 ||
          business.goods.length > 0 ||
          business.services.length > 0
      );
  }, [businesses, searchTerm, filters, selectedCategory]);

  // Load more businesses function
  const loadMoreBusinesses = useCallback(() => {
    if (businessLoading) return;
    setBusinessLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const newCount = Math.min(
        displayedBusinessCount + 3,
        filteredBusinesses.length
      );
      setDisplayedBusinessCount(newCount);
      setBusinessLoading(false);
    }, 800);
  }, [businessLoading, displayedBusinessCount, filteredBusinesses]);

  // Reset displayed count when filters change
  useEffect(() => {
    setDisplayedBusinessCount(3);
    setShouldAnimateMap(new Map()); // Reset animation tracking
  }, [searchTerm, filters]);

  // Track new businesses to animate only newly loaded ones
  useEffect(() => {
    const currentBusinesses = filteredBusinesses.slice(
      0,
      displayedBusinessCount
    );
    setShouldAnimateMap((prev) => {
      const newMap = new Map(prev);

      currentBusinesses.forEach((business: any, index: number) => {
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
          !businessLoading
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
    businessLoading,
    loadMoreBusinesses,
  ]);

  // Get trending businesses (top businesses by average product rating)
  const trendingBusinesses = useMemo(() => {
    if (!businesses) return [];
    
    return businesses
      .map((business: any) => {
        const allProducts = [
          ...business.trending,
          ...business.bestSellers,
          ...business.goods,
          ...business.services,
        ];
        const avgRating =
          allProducts.length > 0
            ? allProducts.reduce((sum: number, product: any) => sum + product.rating, 0) /
              allProducts.length
            : 0;
        const totalReviews = allProducts.reduce(
          (sum: number, product: any) => sum + product.reviews,
          0
        );

        return {
          ...business,
          rating: avgRating,
          totalReviews: totalReviews,
        };
      })
      .filter(
        (business: any) => business.rating >= 4.5 && business.totalReviews >= 50
      )
      .sort((a: any, b: any) => b.rating * b.totalReviews - a.rating * a.totalReviews)
      .slice(0, 12); // Top 12 trending businesses
  }, [businesses]);

  // Get all trending products across all businesses
  const trendingProducts = useMemo(() => {
    if (!businesses) return [];
    
    const allTrendingProducts: any[] = [];

    businesses.forEach((business: any) => {
      // Add trending products
      business.trending.forEach((product: any) => {
        allTrendingProducts.push({
          ...product,
          business: business.name,
          type: "goods" as const,
          sales: product.sales || Math.floor(Math.random() * 1000) + 100, // Use existing sales or mock
        });
      });

      // Add some best sellers as trending too
      business.bestSellers.slice(0, 2).forEach((product: any) => {
        allTrendingProducts.push({
          ...product,
          business: business.name,
          type: "goods" as const,
          sales: product.sales || Math.floor(Math.random() * 1000) + 100,
        });
      });
    });

    // Sort by rating and return top 16
    return allTrendingProducts.sort((a: any, b: any) => b.rating - a.rating).slice(0, 16);
  }, [businesses]);

  const handleFavoriteToggle = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }
      
      // Emit event for other components
      window.dispatchEvent(new CustomEvent('favoriteUpdated', {
        detail: { productId, isFavorite: newFavorites.has(productId) }
      }));
      
      return newFavorites;
    });
  };

  // Function to save updated products data
  const saveProductsData = async (updatedData: ProductsData) => {
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to save data');
      }
      
      setProductsData(updatedData);
      console.log('Data saved successfully:', updatedData);
    } catch (error) {
      console.error('Failed to save data:', error);
    }
  };

  // Function to add a new review using API
  const addReview = async (productId: string, rating: number, comment: string, user: string = 'Anonymous User') => {
    if (!productsData) return;

    const newReview: Review = {
      id: `r${Date.now()}`,
      productId,
      user,
      rating,
      comment,
      date: new Date().toLocaleDateString()
    };

    try {
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'add-review',
          data: newReview
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to add review');
      }
      
      const result = await response.json();
      setProductsData(result.data);
      console.log('Review added successfully:', newReview);
    } catch (error) {
      console.error('Failed to add review:', error);
    }
  };

  // Update handleViewDetails:
  const handleViewDetails = (productId: string) => {
    const product = findProductById(productId, businesses);
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
    // Add the review to our data
    addReview(reviewModal.productId, rating, comment);
    
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
      {loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      ) : error ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      ) : (
        <>
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
          <div className="md:max-w-xs">
            <CategorySelect
              value={selectedCategory}
              onValueChange={setSelectedCategory}
              placeholder="Filter by category"
              showExamples={false}
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
                  const shouldAnimate =
                    shouldAnimateMap.get(business.id) === true;

                  return (
                    <motion.div
                      key={`business-${business.id}`}
                      initial={
                        shouldAnimate
                          ? { opacity: 0, y: 30 }
                          : { opacity: 1, y: 0 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.6,
                        ease: [0.6, -0.05, 0.01, 0.99],
                        delay: shouldAnimate ? (index % 3) * 0.1 : 0, // Stagger animation for new items
                      }}
                      onAnimationComplete={() => {
                        // Mark as animated to prevent re-animation
                        setShouldAnimateMap((prev) => {
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
            reviews={productsData?.reviews || []}
            onSubmitReview={handleSubmitReview}
          />

          {/* Service Detail Modal */}
          <ServiceDetailModal
            isOpen={detailModal.isOpen}
            onClose={() => setDetailModal({ ...detailModal, isOpen: false })}
            serviceData={convertProductToServiceData(detailModal.product)}
            reviews={productsData?.reviews || []}
            onFavoriteToggle={handleFavoriteToggle}
            onSubmitReview={handleSubmitReview}
          />
        </>
      )}
    </motion.div>
  );
}

// Helper functions
function matchesFilters(
  product: any,
  searchTerm: string,
  filters: FilterState,
  selectedCategory?: string
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

  // Selected category filter (from CategorySelect)
  if (selectedCategory && product.category !== selectedCategory) {
    return false;
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

function findProductById(productId: string, businesses: any[]): any {
  for (const business of businesses) {
    const allProducts = [
      ...business.trending,
      ...business.bestSellers,
      ...business.goods,
      ...business.services,
    ];
    const product = allProducts.find((p: any) => p.id === productId);
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
