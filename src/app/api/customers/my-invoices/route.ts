import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function GET(req: NextRequest) {
  console.log("🚀 [API] Get My Invoices route hit!");

  try {
    // Read invoices.json file
    const filePath = path.join(process.cwd(), "public", "data", "invoices.json");
    let invoicesData: { invoices: any[] } = { invoices: [] };
    
    try {
      const fileData = fs.readFileSync(filePath, "utf8");
      invoicesData = JSON.parse(fileData);
    } catch (error) {
      console.log("📄 No invoices.json file found, returning empty array");
    }

    // Read businesses.json for enrichment
    const businessFilePath = path.join(process.cwd(), "public", "data", "businesses.json");
    let businessesData: { businesses: any[] } = { businesses: [] };
    
    try {
      const businessFileData = fs.readFileSync(businessFilePath, "utf8");
      businessesData = JSON.parse(businessFileData);
    } catch (error) {
      console.log("📄 No businesses.json file found");
    }

    // Read products.json for enrichment
    const productsFilePath = path.join(process.cwd(), "public", "data", "products.json");
    let productsData: { products: any[] } = { products: [] };
    
    try {
      const productsFileData = fs.readFileSync(productsFilePath, "utf8");
      productsData = JSON.parse(productsFileData);
    } catch (error) {
      console.log("📄 No products.json file found");
    }

    // Enrich invoices with business and product data
    const enrichedInvoices = invoicesData.invoices.map((invoice) => {
      // Find associated business
      const business = businessesData.businesses.find(b => b.id === invoice.businessId);
      
      // Enrich items with product data and calculate totals
      const enrichedItems = invoice.items?.map((item: any) => {
        const product = productsData.products.find(p => p.id === item.productId);
        return {
          ...item,
          product: product || null,
        };
      }) || [];

      // Calculate total price
      const totalPrice = enrichedItems.reduce((sum: number, item: any) => {
        const price = item.product?.price || item.price || 0;
        return sum + (item.quantity * price);
      }, 0);

      return {
        ...invoice,
        business: business ? { businessType: business.businessType } : null,
        items: enrichedItems,
        totalPrice,
      };
    });

    console.log(`✅ Found ${enrichedInvoices.length} invoices`);

    return NextResponse.json(
      { success: true, data: enrichedInvoices },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching invoices:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
