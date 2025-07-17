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
        setError(null);

        console.log("🔄 Loading invoice data...");

        // Load all data in parallel
        const [users, businesses, invoices, invoiceProducts, products] =
          await Promise.all([
            loadUsersData(),
            loadBusinessesData(),
            loadInvoicesData(),
            loadInvoiceProductsData(),
            loadProductsData(),
          ]);

        console.log("📊 Data loaded:", {
          users: users?.length || 0,
          businesses: businesses?.length || 0,
          invoices: invoices?.length || 0,
          invoiceProducts: invoiceProducts?.length || 0,
          products: products?.length || 0,
        });

        // Validate critical data
        if (!Array.isArray(users)) {
          throw new Error("Users data is invalid or missing");
        }
        if (!Array.isArray(businesses)) {
          throw new Error("Businesses data is invalid or missing");
        }
        if (!Array.isArray(invoices)) {
          throw new Error("Invoices data is invalid or missing");
        }

        // Create lookup maps
        const userLookup = createAddressLookup(users);
        const businessLookup = createBusinessLookup(businesses);

        // Enhance invoice data
        const enhanced = enhanceInvoiceData(
          invoices,
          invoiceProducts || [],
          products || [],
          userLookup,
          businessLookup
        );

        console.log("✅ Enhanced invoices:", enhanced.length);
        setEnhancedInvoices(enhanced);
        setError(null);
      } catch (err) {
        console.error("❌ Failed to load enhanced invoice data:", err);
        setError(
          `Failed to load invoice data: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
        setEnhancedInvoices([]);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  return { enhancedInvoices, loading, error };
}
