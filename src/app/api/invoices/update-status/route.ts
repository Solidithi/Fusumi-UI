import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function PUT(request: NextRequest) {
  try {
    const { invoiceId, newStatus } = await request.json();

    if (!invoiceId || !newStatus) {
      return NextResponse.json(
        { error: "Invoice ID and new status are required" },
        { status: 400 }
      );
    }

    // Read the current invoices data
    const filePath = path.join(process.cwd(), "public", "data", "invoices.json");
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    // Find and update the invoice
    const invoiceIndex = data.invoices.findIndex(
      (invoice: any) => invoice.id === invoiceId
    );

    if (invoiceIndex === -1) {
      return NextResponse.json(
        { error: "Invoice not found" },
        { status: 404 }
      );
    }

    // Update the invoice status and updatedAt timestamp
    data.invoices[invoiceIndex].paidStatus = newStatus;
    data.invoices[invoiceIndex].updatedAt = new Date().toISOString();

    // Write the updated data back to the file
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));

    return NextResponse.json({
      success: true,
      message: "Invoice status updated successfully",
      invoice: data.invoices[invoiceIndex],
    });
  } catch (error) {
    console.error("Error updating invoice status:", error);
    return NextResponse.json(
      { error: "Failed to update invoice status" },
      { status: 500 }
    );
  }
}
