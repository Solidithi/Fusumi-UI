export interface NavigationItem {
  label: string;
  href: string;
}

export interface AnimationVariants {
  hidden: any;
  visible: any;
}

export interface ParallaxConfig {
  y: [string, string];
  opacity: [number, number];
  scale: [number, number];
}

export interface Product {
  id: string;
  productName: string;
  productType: string;
  price: number;
  unitOfMeasure: string;
  description: string;
  images: string[];
  startDate: string;
  endDate: string;
  businessId: string;
  category: string;
  rating: number;
  reviews: number;
  sales: number;
}

export interface Business {
  id: string;
  businessName: string;
  registrationNumber: string;
  incorporationDate: string;
  businessType: string;
  officialWebsite: string;
  businessLogo: string;
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
  walletAddress?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Invoice {
  id: string;
  ownerAddress: string;
  debtorAddress: string;
  description: string;
  paidStatus: string;
  startDate: string;
  endDate: string;
  attachments: string[];
  businessId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceProduct {
  invoiceId: string;
  productId: string;
  quantity: number;
}

export interface BillingItem {
  id: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
}
