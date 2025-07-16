import type {
  EnhancedInvoiceData,
  UserProfile,
  BusinessProfile,
  InvoiceProduct,
  InvoiceSortConfig,
  InvoiceFilterConfig,
  SortDirection,
} from "@/types/dashboard";

// Data loading utilities
export async function loadUsersData(): Promise<UserProfile[]> {
  const response = await fetch("/data/users.json");
  const data = await response.json();
  return data.users;
}

export async function loadBusinessesData(): Promise<BusinessProfile[]> {
  const response = await fetch("/data/businesses.json");
  const data = await response.json();
  return data.businesses;
}

export async function loadInvoicesData(): Promise<any[]> {
  const response = await fetch("/data/invoices.json");
  const data = await response.json();
  return data.invoices;
}

export async function loadInvoiceProductsData(): Promise<any[]> {
  const response = await fetch("/data/invoices.json");
  const data = await response.json();
  return data.invoiceProducts;
}

export async function loadProductsData(): Promise<any[]> {
  const response = await fetch("/data/invoices.json");
  const data = await response.json();
  return data.products;
}

// Address resolution utilities
export function createAddressLookup(
  users: UserProfile[]
): Map<string, UserProfile> {
  return new Map(users.map((user) => [user.address, user]));
}

export function createBusinessLookup(
  businesses: BusinessProfile[]
): Map<string, BusinessProfile> {
  return new Map(businesses.map((business) => [business.id, business]));
}

export function createProductLookup(products: any[]): Map<string, any> {
  return new Map(products.map((product) => [product.id, product]));
}

// Enhanced invoice data processing
export function enhanceInvoiceData(
  invoices: any[],
  invoiceProducts: any[],
  products: any[],
  userLookup: Map<string, UserProfile>,
  businessLookup: Map<string, BusinessProfile>
): EnhancedInvoiceData[] {
  // Create product lookup
  const productLookup = createProductLookup(products);

  // Create invoice products lookup with calculated values
  const productsByInvoice = invoiceProducts.reduce((acc, invoiceProduct) => {
    const product = productLookup.get(invoiceProduct.productId);
    if (product) {
      const enrichedProduct = {
        ...invoiceProduct,
        productName: product.productName,
        unitPrice: product.price,
        totalPrice: product.price * invoiceProduct.quantity,
        category: product.productType,
        description: product.description,
      };

      if (!acc[invoiceProduct.invoiceId]) {
        acc[invoiceProduct.invoiceId] = [];
      }
      acc[invoiceProduct.invoiceId].push(enrichedProduct);
    }
    return acc;
  }, {} as Record<string, any[]>);

  return invoices.map((invoice) => {
    const owner = userLookup.get(invoice.ownerAddress);
    const debtor = userLookup.get(invoice.debtorAddress);
    const business = businessLookup.get(invoice.businessId);
    const products = productsByInvoice[invoice.id] || [];
    const totalValue = products.reduce(
      (sum: number, product: any) => sum + product.totalPrice,
      0
    );

    return {
      ...invoice,
      totalValue,
      ownerAlias: owner?.alias,
      ownerName: owner?.name,
      ownerType: owner?.type,
      debtorAlias: debtor?.alias,
      debtorName: debtor?.name,
      debtorType: debtor?.type,
      businessName: business?.businessName,
    };
  });
}

// Address display utilities
export function formatAddressDisplay(
  address: string,
  alias?: string,
  name?: string,
  type?: "business" | "customer"
): string {
  if (alias) {
    return alias;
  }
  if (name) {
    return name;
  }
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export function getFullAddressInfo(
  address: string,
  alias?: string,
  name?: string,
  type?: "business" | "customer"
): { display: string; title: string; type?: string } {
  const display = formatAddressDisplay(address, alias, name, type);
  const title = alias || name || address;

  return {
    display,
    title,
    type,
  };
}

// Sorting utilities
export function sortInvoices(
  invoices: EnhancedInvoiceData[],
  sortConfig: InvoiceSortConfig
): EnhancedInvoiceData[] {
  return [...invoices].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortConfig.field) {
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      case "totalValue":
        aValue = a.totalValue || 0;
        bValue = b.totalValue || 0;
        break;
      case "endDate":
        aValue = new Date(a.endDate).getTime();
        bValue = new Date(b.endDate).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });
}

// Filtering utilities
export function filterInvoices(
  invoices: EnhancedInvoiceData[],
  filterConfig: InvoiceFilterConfig
): EnhancedInvoiceData[] {
  return invoices.filter((invoice) => {
    // Status filter
    if (
      filterConfig.status &&
      filterConfig.status !== "all" &&
      invoice.paidStatus !== filterConfig.status
    ) {
      return false;
    }

    // Debtor type filter
    if (
      filterConfig.debtorType &&
      filterConfig.debtorType !== "all" &&
      invoice.debtorType !== filterConfig.debtorType
    ) {
      return false;
    }

    // Business filter
    if (
      filterConfig.businessId &&
      invoice.businessId !== filterConfig.businessId
    ) {
      return false;
    }

    // Search term filter
    if (filterConfig.searchTerm) {
      const searchTerm = filterConfig.searchTerm.toLowerCase();
      const searchableFields = [
        invoice.ownerAlias,
        invoice.ownerName,
        invoice.debtorAlias,
        invoice.debtorName,
        invoice.businessName,
        invoice.description,
        invoice.ownerAddress,
        invoice.debtorAddress,
      ]
        .filter(Boolean)
        .map((field) => field!.toLowerCase());

      if (!searchableFields.some((field) => field.includes(searchTerm))) {
        return false;
      }
    }

    return true;
  });
}

// Status badge utilities
export function getStatusBadgeColor(status: string): {
  bg: string;
  text: string;
} {
  switch (status) {
    case "PAID":
      return { bg: "bg-green-100", text: "text-green-800" };
    case "PENDING":
      return { bg: "bg-yellow-100", text: "text-yellow-800" };
    case "OVERDUE":
      return { bg: "bg-red-100", text: "text-red-800" };
    default:
      return { bg: "bg-gray-100", text: "text-gray-800" };
  }
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function formatDateTime(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
