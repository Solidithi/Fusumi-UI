/**
 * Data Test Utility
 * Test the invoice data loading functionality
 */

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

export async function testInvoiceDataLoading() {
  try {
    console.log("🔍 Testing invoice data loading...");

    // Load all data
    const [users, businesses, invoices, invoiceProducts, products] =
      await Promise.all([
        loadUsersData(),
        loadBusinessesData(),
        loadInvoicesData(),
        loadInvoiceProductsData(),
        loadProductsData(),
      ]);

    console.log("📊 Data loaded successfully:");
    console.log(`- Users: ${users.length}`);
    console.log(`- Businesses: ${businesses.length}`);
    console.log(`- Invoices: ${invoices.length}`);
    console.log(`- Invoice Products: ${invoiceProducts.length}`);
    console.log(`- Products: ${products.length}`);

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

    console.log("✅ Enhanced invoice data:");
    enhanced.forEach((invoice, index) => {
      console.log(`${index + 1}. ${invoice.description}`);
      console.log(`   Owner: ${invoice.ownerAlias || invoice.ownerAddress}`);
      console.log(`   Debtor: ${invoice.debtorAlias || invoice.debtorAddress}`);
      console.log(`   Business: ${invoice.businessName}`);
      console.log(`   Status: ${invoice.paidStatus}`);
      console.log(`   Value: $${invoice.totalValue?.toLocaleString()}`);
      console.log("");
    });

    // Count by status
    const statusCounts = enhanced.reduce((acc, invoice) => {
      acc[invoice.paidStatus] = (acc[invoice.paidStatus] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("📈 Status Summary:");
    console.log(`- PAID: ${statusCounts.PAID || 0}`);
    console.log(`- PENDING: ${statusCounts.PENDING || 0}`);
    console.log(`- OVERDUE: ${statusCounts.OVERDUE || 0}`);

    return enhanced;
  } catch (error) {
    console.error("❌ Error testing invoice data:", error);
    throw error;
  }
}

// Export for use in development
if (typeof window !== "undefined") {
  (window as any).testInvoiceData = testInvoiceDataLoading;
}
