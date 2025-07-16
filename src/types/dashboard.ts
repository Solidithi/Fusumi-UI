export interface InvoiceData {
  id: string;
  addressOwner: string;
  addressDebtor: string;
  unitDebt: number;
  startDate: string;
  endDate: string;
  fieldCompany: string;
  status: "paid" | "unpaid" | "pending";
}

// Enhanced types for new invoice table functionality
export interface EnhancedInvoiceData {
  id: string;
  ownerAddress: string;
  debtorAddress: string;
  description: string;
  paidStatus: "PAID" | "PENDING" | "OVERDUE";
  startDate: string;
  endDate: string;
  attachments: string[];
  businessId: string;
  createdAt: string;
  updatedAt: string;
  totalValue?: number; // Calculated from invoice products
  // Enriched data for display
  ownerAlias?: string;
  ownerName?: string;
  ownerType?: "business" | "customer";
  debtorAlias?: string;
  debtorName?: string;
  debtorType?: "business" | "customer";
  businessName?: string;
}

export interface UserProfile {
  address: string;
  alias: string;
  type: "business" | "customer";
  name: string;
  businessId?: string;
  joinedAt: string;
}

export interface BusinessProfile {
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
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceProduct {
  id: string;
  invoiceId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  description?: string;
}

export interface DashboardStats {
  totalInvoices: number;
  paidInvoices: number;
  unpaidInvoices: number;
}

export type FilterType = "total" | "paid" | "unpaid";

export type InvoiceSortField = "createdAt" | "totalValue" | "endDate";
export type SortDirection = "asc" | "desc";

export interface InvoiceSortConfig {
  field: InvoiceSortField;
  direction: SortDirection;
}

export interface InvoiceFilterConfig {
  status?: "PAID" | "PENDING" | "OVERDUE" | "all";
  debtorType?: "business" | "customer" | "all";
  businessId?: string;
  searchTerm?: string;
}
