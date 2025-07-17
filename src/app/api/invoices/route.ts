import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // Read the current invoices data
    const filePath = path.join(
      process.cwd(),
      "public",
      "data",
      "invoices.json"
    );
    const fileContents = fs.readFileSync(filePath, "utf8");
    const data = JSON.parse(fileContents);

    return NextResponse.json({
      success: true,
      invoices: data.invoices,
    });
  } catch (error) {
    console.error("Error reading invoices:", error);
    return NextResponse.json(
      { error: "Failed to read invoices" },
      { status: 500 }
    );
  }
}
