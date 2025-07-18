import { businesses } from "@/../public/data/businesses.json";
import { BusinessId, Business } from "@/types/business";
import { Product, Invoice, InvoiceProduct } from "@/types";

export function getBusinessById(
  businessId: `bus-${string}`
): Business | undefined {
  return businesses.find((b) => b.id === businessId);
}

// Utility functions for business and product management

export interface BusinessProductService {
  loadProducts: (businessId: string) => Promise<Product[]>;
  getCurrentBusinessId: () => string | null;
  createInvoice: (
    invoiceData: Partial<Invoice>,
    products: { productId: string; quantity: number }[]
  ) => Promise<boolean>;
}

export async function loadProductsByBusiness(
  businessId: string
): Promise<Product[]> {
  try {
    const response = await fetch("/data/products.json");
    const data = await response.json();

    if (!data.products || !Array.isArray(data.products)) {
      console.error("Invalid products data structure");
      return [];
    }

    return data.products.filter(
      (product: Product) => product.businessId === businessId
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return [];
  }
}

export async function loadBusinesses(): Promise<Business[]> {
  try {
    const response = await fetch("/data/businesses.json");
    const data = await response.json();

    if (!data.businesses || !Array.isArray(data.businesses)) {
      console.error("Invalid businesses data structure");
      return [];
    }

    return data.businesses;
  } catch (error) {
    console.error("Error loading businesses:", error);
    return [];
  }
}

export async function getCurrentBusinessId(
  userAddress?: string
): Promise<string | null> {
  if (!userAddress) {
    console.log("getCurrentBusinessId: No user address provided");
    return null;
  }

  console.log(
    "getCurrentBusinessId: Looking up business for address:",
    userAddress
  );

  try {
    // Load businesses from the JSON file
    const businesses = await loadBusinesses();
    console.log(
      "getCurrentBusinessId: Loaded",
      businesses.length,
      "businesses"
    );

    // Find business that matches the user's wallet address
    const matchingBusiness = businesses.find(
      (business) =>
        business.walletAddress &&
        business.walletAddress === userAddress.toLowerCase()
    );

    if (matchingBusiness) {
      console.log(
        "getCurrentBusinessId: Found matching business:",
        matchingBusiness.id,
        "for address:",
        userAddress
      );
    } else {
      console.log(
        "getCurrentBusinessId: No matching business found for address:",
        userAddress
      );
    }

    return matchingBusiness ? matchingBusiness.id : null;
  } catch (error) {
    console.error("Error getting current business ID:", error);
    return null;
  }
}

export async function saveInvoiceToFile(
  invoiceData: Partial<Invoice>,
  products: { productId: string; quantity: number }[]
): Promise<boolean> {
  try {
    // Generate a unique invoice ID
    const invoiceId = `inv-${Date.now()}`;

    const newInvoice: Invoice = {
      id: invoiceId,
      ownerAddress: invoiceData.ownerAddress || "",
      debtorAddress: invoiceData.debtorAddress || "",
      description: invoiceData.description || "",
      paidStatus: "UNPAID",
      startDate: invoiceData.startDate || new Date().toISOString(),
      endDate: invoiceData.endDate || new Date().toISOString(),
      attachments: invoiceData.attachments || [],
      businessId: invoiceData.businessId || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Create invoice products mapping
    const invoiceProducts: InvoiceProduct[] = products.map(
      ({ productId, quantity }) => ({
        invoiceId,
        productId,
        quantity,
      })
    );

    // In a real application, this would be a server-side API call
    // For now, we'll simulate the save operation
    console.log("Saving invoice:", newInvoice);
    console.log("Saving invoice products:", invoiceProducts);

    // Make API call to save the invoice
    const response = await fetch("/api/business/save-invoice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        invoice: newInvoice,
        invoiceProducts,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to save invoice");
    }

    return true;
  } catch (error) {
    console.error("Error saving invoice:", error);
    return false;
  }
}
