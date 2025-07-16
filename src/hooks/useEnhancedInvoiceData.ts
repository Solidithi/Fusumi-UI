import { useState, useEffect } from "react";
import type {
  EnhancedInvoiceData,
  UserProfile,
  BusinessProfile,
} from "@/types/dashboard";
import {
  loadUsersData,
  loadBusinessesData,
  loadInvoicesData,
  loadInvoiceProductsData,
  loadProductsData,
  createAddressLookup,
  createBusinessLookup,
  enhanceInvoiceData,
} from "@/utils/invoiceUtils";

export function useEnhancedInvoiceData() {
  const [enhancedInvoices, setEnhancedInvoices] = useState<
    EnhancedInvoiceData[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);

        // Load all data in parallel
        const [users, businesses, invoices, invoiceProducts, products] =
          await Promise.all([
            loadUsersData(),
            loadBusinessesData(),
            loadInvoicesData(),
            loadInvoiceProductsData(),
            loadProductsData(),
          ]);

        // Create lookup maps
        const userLookup = createAddressLookup(users);
        const businessLookup = createBusinessLookup(businesses);

        // Enhance invoice data
        const enhanced = enhanceInvoiceData(
          invoices,
          invoiceProducts,
          products,
          userLookup,
          businessLookup
        );

        setEnhancedInvoices(enhanced);
        setError(null);
      } catch (err) {
        console.error("Failed to load enhanced invoice data:", err);
        setError("Failed to load invoice data");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { enhancedInvoices, loading, error };
}
