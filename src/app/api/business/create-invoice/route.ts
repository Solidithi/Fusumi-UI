import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  console.log("🚀 [API] Create Invoice route hit!");

  try {
    const body = await req.json();
    console.log("📤 Request Body:", JSON.stringify(body, null, 2));

    const {
      ownerAddress,
      debtorAddress,
      description,
      startDate,
      endDate,
      billing,
      agreements,
      businessId,
    } = body;

    console.log("📋 Parsed fields:", {
      ownerAddress,
      debtorAddress,
      description,
      startDate,
      endDate,
      billing,
      agreements,
      businessId,
    });

    // Validate required fields
    if (!debtorAddress || !description || !startDate || !endDate) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Read current invoices.json file
    const filePath = path.join(process.cwd(), "public", "data", "invoices.json");
    let invoicesData: { invoices: any[] } = { invoices: [] };
    
    try {
      const fileData = fs.readFileSync(filePath, "utf8");
      invoicesData = JSON.parse(fileData);
    } catch (error) {
      console.log("📄 Creating new invoices.json file");
      // Create the directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Generate new invoice ID
    const existingIds = invoicesData.invoices.map((invoice: any) => invoice.id);
    const maxNum = existingIds
      .filter((id: string) => id.startsWith("inv-"))
      .map((id: string) => parseInt(id.split("-")[1]))
      .reduce((max: number, num: number) => Math.max(max, num), 0);
    const newId = `inv-${String(maxNum + 1).padStart(3, "0")}`;

    // Process billing items
    const processedItems = billing?.items?.map((item: any) => ({
      quantity: parseInt(item.quantity) || 1,
      productId: item.productId || "",
      price: parseFloat(item.price) || 0,
      total: (parseInt(item.quantity) || 1) * (parseFloat(item.price) || 0),
    })) || [];

    // Calculate total amount
    const totalAmount = processedItems.reduce((sum: number, item: any) => sum + item.total, 0);

    // Create new invoice object
    const newInvoice = {
      id: newId,
      ownerAddress: ownerAddress || "",
      debtorAddress,
      description,
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      attachments: agreements || [],
      paidStatus: "PENDING",
      businessId: businessId || "",
      items: processedItems,
      totalAmount,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add new invoice to the array
    invoicesData.invoices.push(newInvoice);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(invoicesData, null, 4));

    console.log("✅ New invoice created:", JSON.stringify(newInvoice, null, 2));

    return NextResponse.json(
      { success: true, data: newInvoice },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error creating invoice:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
