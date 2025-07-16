// enums
export enum UserRole {
  BUSINESS = "BUSINESS",
  CUSTOMER = "CUSTOMER",
}

export enum PaidStatus {
  TOTAL = "TOTAL",
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export enum OfferStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  EXPIRED = "EXPIRED",
}

export enum ProductType {
  SERVICE = "SERVICE",
  PRODUCT = "PRODUCT",
}

export enum CustomerInfoField {
  EMAIL = "EMAIL",
  FULL_NAME = "FULL_NAME",
  PHONE = "PHONE",
  ADDRESS = "ADDRESS",
  ZIPCODE = "ZIPCODE",
  NATIONALITY = "NATIONALITY",
  PERSONAL_ID = "PERSONAL_ID",
  SEX = "SEX",
  BIRTHDATE = "BIRTHDATE",
  IMAGE = "IMAGE",
  TAX_ID = "TAX_ID",
  KYC_IMAGE = "KYC_IMAGE",
}

// models

export interface Product {
  id: string;
  productName: string;
  productType: ProductType;
  price: number;
  unitOfMeasure: string;
  description?: string | null;
  images: string[];
  startDate: string; // DateTime → ISO string
  endDate: string;
  createdAt: string;
  updatedAt: string;
  // relations:
  invoices?: InvoiceProduct[];
  services?: Service[];
}

export interface Invoice {
  id: string;
  ownerAddress: string;
  debtorAddress: string;
  description?: string | null;
  paidStatus: PaidStatus;
  startDate: string;
  endDate: string;
  attachments: string[];
  businessId: string;
  createdAt: string;
  updatedAt: string;
  // relations:
  business?: Business;
  items?: InvoiceProduct[];
}

export interface InvoiceProduct {
  id: string;
  invoiceId: string;
  productId: string;
  quantity: number;
  invoice?: Invoice;
  product?: Product;
}

export interface ServiceCustomerField {
  id: string;
  serviceId: string;
  field: CustomerInfoField;
  service?: Service;
}

export interface Service {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  imageUrl?: string | null;
  startDate: string;
  endDate: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  businessId: string;
  business?: Business;
  customerFields?: ServiceCustomerField[];
  products?: Product[];
}

export interface Offer {
  id: string;
  invoiceAddress: string;
  pricing: number;
  offerStatus: OfferStatus;
  startDate: string;
  endDate: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
  businessId: string;
  business?: Business;
  offerContacts?: OfferContact[];
}

export interface OfferContact {
  offerId: string;
  businessId: string;
  business?: Business;
  offer?: Offer;
}

export interface User {
  id: string;
  email: string;
  fullName?: string | null;
  phone?: string | null;
  address?: string | null;
  zipcode?: string | null;
  nationality?: string | null;
  personalId?: string | null;
  sex?: string | null;
  birthDate?: string | null; // DateTime
  imageUrl?: string | null;
  taxId?: string | null;
  kycImageUrl: string[];
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface Business {
  id: string;
  businessName: string;
  registrationNumber: string;
  incorporationDate: string;
  businessType: string;
  officialWebsite?: string | null;
  businessLogo?: string | null;
  legalRepFullName: string;
  legalRepId: string;
  legalRepPosition: string;
  legalRepNationality: string;
  taxId: string;
  financialProfile: string[];
  documentUrls: string[];
  createdAt: string;
  updatedAt: string;
  invoices?: Invoice[];
  offers?: Offer[];
  OfferContact?: OfferContact[];
  services?: Service[];
}
