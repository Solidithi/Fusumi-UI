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
  walletAddress: string;
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

  // Load data from JSON files
  useEffect(() => {
    const loadProductsData = async () => {
      try {
        setLoading(true);

        // Load data from JSON files with cache busting to avoid interception
        const timestamp = Date.now();
        const randomId = Math.random().toString(36).substring(7);

        // Use XMLHttpRequest for products to bypass Console Ninja
        const productsData = await new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.open(
            "GET",
            `/data/products.json?nocache=${timestamp}&r=${randomId}&v=3&bypass=true&xhr=1`,
            true
          );
          xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
              if (xhr.status === 200) {
                try {
                  const responseText = xhr.responseText;
                  console.log(
                    "XHR products response (first 200 chars):",
                    responseText.substring(0, 200)
                  );

                  // Check if Console Ninja is still intercepting
                  if (responseText.includes("PRO FEATURE ONLY")) {
                    console.error(
                      "Console Ninja still intercepting XHR products request"
                    );
                    reject(new Error("Products data intercepted via XHR"));
                    return;
                  }

                  const data = JSON.parse(responseText);
                  resolve(data);
                } catch (parseError) {
                  console.error("JSON parse error for products:", parseError);
                  reject(parseError);
                }
              } else {
                console.error(
                  "XHR products failed:",
                  xhr.status,
                  xhr.statusText
                );
                reject(new Error(`XHR products error! status: ${xhr.status}`));
              }
            }
          };
          xhr.send();
        });

        // Use regular fetch for businesses (this seems to work)
        const businessesResponse = await fetch(
          `/data/businesses.json?t=${timestamp}`
        );

        console.log("Businesses response status:", businessesResponse.status);

        if (!businessesResponse.ok) {
          throw new Error("Failed to load businesses data");
        }

        const businessesText = await businessesResponse.text();
        console.log(
          "Businesses text (first 200 chars):",
          businessesText.substring(0, 200)
        );

        const businessesData = JSON.parse(businessesText);
        console.log("Parsed businesses data:", businessesData);

        // Combine the data into the expected format
        const data: ProductsData = {
          businesses: businessesData.businesses || [],
          products: (productsData as any).products || [],
          services: (productsData as any).services || [],
          reviews: (productsData as any).reviews || [],
        };

        setProductsData(data);

        // Load favorites from localStorage
        const savedFavorites = localStorage.getItem("product-favorites");
        if (savedFavorites) {
          setFavorites(new Set(JSON.parse(savedFavorites)));
        }
      } catch (err) {
        console.error("Error loading data via XHR, using fallback data:", err);

        // Create minimal demo data with the wallet address we need
        const fallbackData: ProductsData = {
          businesses: [
            {
              id: "0x2ea52e6ae741e7c0f8301523c1ee70ffb99a5c9f6776cce3e94699828bccbb38",
              businessName: "Demo Business",
              registrationNumber: "DEMO001",
              incorporationDate: "2024-01-01",
              businessType: "Technology",
              officialWebsite: "https://demo.business.com",
              businessLogo: undefined,
              legalRepFullName: "Demo Representative",
              legalRepId: "DEMO123",
              legalRepPosition: "CEO",
              legalRepNationality: "US",
              taxId: "TAX123",
              financialProfile: [],
              documentUrls: [],
              description: "A demo business for testing JSON data loading",
              rating: 4.5,
              totalReviews: 10,
              walletAddress: "0x2ea52e6ae741e7c0f8301523c1ee70ffb99a5c9f6776cce3e94699828bccbb38",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z",
            },
          ],
          products: [
            {
              id: "demo-product-1",
              productName: "Demo Product 1",
              productType: "PRODUCT",
              price: 99.99,
              unitOfMeasure: "piece",
              description: "First demo product loaded from JSON data",
              images: [],
              startDate: "2024-01-01T00:00:00Z",
              endDate: "2024-12-31T23:59:59Z",
              businessId:
                "0x2ea52e6ae741e7c0f8301523c1ee70ffb99a5c9f6776cce3e94699828bccbb38",
              category: "Demo Category",
              rating: 4.8,
              reviews: 5,
              sales: 100,
              type: "goods",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z",
            },
            {
              id: "demo-product-2",
              productName: "Demo Product 2",
              productType: "SERVICE",
              price: 149.99,
              unitOfMeasure: "hour",
              description: "Second demo product - a service offering",
              images: [],
              startDate: "2024-01-01T00:00:00Z",
              endDate: "2024-12-31T23:59:59Z",
              businessId:
                "0x2ea52e6ae741e7c0f8301523c1ee70ffb99a5c9f6776cce3e94699828bccbb38",
              category: "Demo Services",
              rating: 4.5,
              reviews: 8,
              sales: 50,
              type: "service",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z",
            },
            {
              id: "demo-product-3",
              productName: "Demo Product 3",
              productType: "PRODUCT",
              price: 79.99,
              unitOfMeasure: "piece",
              description: "Third demo product with unique features",
              images: [],
              startDate: "2024-01-01T00:00:00Z",
              endDate: "2024-12-31T23:59:59Z",
              businessId:
                "0x2ea52e6ae741e7c0f8301523c1ee70ffb99a5c9f6776cce3e94699828bccbb38",
              category: "Demo Category",
              rating: 4.9,
              reviews: 12,
              sales: 75,
              type: "goods",
              createdAt: "2024-01-01T00:00:00Z",
              updatedAt: "2024-01-01T00:00:00Z",
            },
          ],
          services: [],
          reviews: [],
        };

        setProductsData(fallbackData);
        console.log(
          "Set fallback data with business ID:",
          fallbackData.businesses[0].id
        );
      } finally {
        setLoading(false);
      }
    };

    loadProductsData();
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem(
      "product-favorites",
      JSON.stringify(Array.from(favorites))
    );
  }, [favorites]);

  // Create business objects with products grouped
  const businesses = useMemo(() => {
    if (!productsData) return [];

    return productsData.businesses.map((business) => {
      const businessProducts = productsData.products.filter(
        (p) => p.businessId === business.id || p.businessId === business.walletAddress
      );
      const businessServices = productsData.services.filter(
        (s) => s.businessId === business.id || s.businessId === business.walletAddress
      );

      return {
        ...business,
        name: business.businessName,
        logo: business.businessLogo || `https://ui-avatars.com/api/?name=${encodeURIComponent(business.businessName)}&background=3587A3&color=fff&size=64`,
        trending: businessProducts.filter(p => p.rating >= 4.0).slice(0, 3).map(p => ({
          ...p,
          name: p.productName, // Add name field for consistency
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400x300.png?text=No+Image', // Add image field from images array
          business: business.businessName
        })),
        bestSellers: businessProducts.sort((a, b) => b.sales - a.sales).slice(0, 3).map(p => ({
          ...p,
          name: p.productName, // Add name field for consistency
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400x300.png?text=No+Image', // Add image field from images array
          business: business.businessName
        })),
        goods: businessProducts.filter(p => p.type === 'goods').map(p => ({
          ...p,
          name: p.productName, // Add name field for consistency
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400x300.png?text=No+Image', // Add image field from images array
          business: business.businessName
        })),
        services: businessProducts.filter(p => p.type === 'service').map(p => ({
          ...p,
          name: p.productName, // Add name field for consistency
          image: p.images && p.images.length > 0 ? p.images[0] : 'https://via.placeholder.com/400x300.png?text=No+Image', // Add image field from images array
          business: business.businessName
        })).concat(
          businessServices.map(s => ({
            ...s,
            id: `service-${s.id}`, // Prefix to ensure unique IDs
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
    if (!businesses || !productsData?.products) return [];

    const products = productsData.products;

    return businesses
      .map((business: any) => {
        // Find all products for this business
        const businessProducts = products.filter(
          (product: any) => product.businessId === business.id || product.businessId === business.walletAddress
        );
        
        const avgRating =
          businessProducts.length > 0
            ? businessProducts.reduce(
                (sum: number, product: any) => sum + product.rating,
                0
              ) / businessProducts.length
            : business.rating || 0;
        
        const totalReviews = businessProducts.reduce(
          (sum: number, product: any) => sum + product.reviews,
          0
        );

        return {
          ...business,
          rating: avgRating,
          totalReviews: totalReviews,
          productCount: businessProducts.length,
        };
      })
      .filter(
        (business: any) => business.rating >= 0 // Show all businesses
      )
      .sort(
        (a: any, b: any) =>
          b.rating * (b.totalReviews + 1) - a.rating * (a.totalReviews + 1)
      )
      .slice(0, 12); // Top 12 trending businesses
  }, [businesses, productsData]);

  // Get all trending products across all businesses
  const trendingProducts = useMemo(() => {
    if (!businesses || !productsData?.products) return [];

    const products = productsData.products;
    const allTrendingProducts: any[] = [];

    // Get all products and add business information
    products.forEach((product: any) => {
      const business = businesses.find((b: any) => 
        b.id === product.businessId || b.walletAddress === product.businessId
      );
      
      if (business) {
        allTrendingProducts.push({
          ...product,
          name: product.productName, // Add name field for consistency
          image: product.images && product.images.length > 0 ? product.images[0] : 'https://via.placeholder.com/400x300.png?text=No+Image', // Add image field from images array
          business: business.businessName || business.name,
          businessInfo: business,
          type: product.type || "goods",
          sales: product.sales || Math.floor(Math.random() * 1000) + 100,
        });
      }
    });

    // Sort by rating and return top 16
    const result = allTrendingProducts
      .sort((a: any, b: any) => b.rating - a.rating)
      .slice(0, 16);
    
    console.log("Trending Products Debug:", {
      totalProducts: products.length,
      businessesFound: businesses.length,
      trendingProducts: result.length,
      sampleProduct: result[0],
    });
    
    return result;
  }, [businesses, productsData]);

  const handleFavoriteToggle = (productId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(productId)) {
        newFavorites.delete(productId);
      } else {
        newFavorites.add(productId);
      }

      // Emit event for other components
      window.dispatchEvent(
        new CustomEvent("favoriteUpdated", {
          detail: { productId, isFavorite: newFavorites.has(productId) },
        })
      );

      return newFavorites;
    });
  };

  // Function to save updated products data (local state only)
  const saveProductsData = async (updatedData: ProductsData) => {
    try {
      // For now, just update local state since we're working with static JSON files
      // In a real application, this would save to a backend API
      setProductsData(updatedData);
      console.log("Data updated locally:", updatedData);
    } catch (error) {
      console.error("Failed to update data:", error);
    }
  };

  // Function to add a new review to local data
  const addReview = (
    productId: string,
    rating: number,
    comment: string,
    user: string = "Anonymous User"
  ) => {
    if (!productsData) return;

    const newReview: Review = {
      id: `r${Date.now()}`,
      productId,
      user,
      rating,
      comment,
      date: new Date().toLocaleDateString(),
    };

    // Update local products data with new review
    const updatedProductsData = {
      ...productsData,
      reviews: [...(productsData.reviews || []), newReview],
    };

    setProductsData(updatedProductsData);
    console.log("Review added successfully:", newReview);
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
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Error Loading Data
            </h2>
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
                All Offers
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
              <ProductFilters
                activeFilters={filters}
                onFilterChange={setFilters}
              />
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
                    <div
                      ref={loadingRef}
                      className="flex justify-center mt-8 py-4"
                    >
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
                    No Offers Found
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
    const productName = product.name || product.productName || '';
    const businessName = product.business || '';
    const categoryName = product.category || '';
    
    const matchesSearch =
      productName.toLowerCase().includes(searchLower) ||
      businessName.toLowerCase().includes(searchLower) ||
      categoryName.toLowerCase().includes(searchLower);

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
    serviceName: product.name || product.productName || 'Unknown Service',
    businessName: product.business,
    description:
      product.description ||
      `Experience our premium ${product.name || product.productName || 'service'} service. Quality guaranteed with excellent customer support.`,
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
