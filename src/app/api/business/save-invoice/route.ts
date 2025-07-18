import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { invoice, invoiceProducts } = body;

    if (!invoice || !invoiceProducts) {
      return NextResponse.json(
        { success: false, error: "Missing invoice or product data" },
        { status: 400 }
      );
    }

    // Read current invoices
    const invoicesPath = path.join(
      process.cwd(),
      "public",
      "data",
      "invoices.json"
    );
    const invoicesData = await fs.readFile(invoicesPath, "utf8");
    const invoicesJson = JSON.parse(invoicesData);

    // Add new invoice
    invoicesJson.invoices.push(invoice);

    // Add invoice products
    if (!invoicesJson.invoiceProducts) {
      invoicesJson.invoiceProducts = [];
    }
    invoicesJson.invoiceProducts.push(...invoiceProducts);

    // Write back to file
    await fs.writeFile(invoicesPath, JSON.stringify(invoicesJson, null, 4));

    return NextResponse.json({ success: true, invoiceId: invoice.id });
  } catch (error) {
    console.error("Error saving invoice:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save invoice" },
      { status: 500 }
    );
  }
}
