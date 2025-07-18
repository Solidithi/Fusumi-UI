import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  console.log("🚀 [API] Create Business route hit!");

  try {
    const body = await req.json();

    const {
      businessName,
      registrationNumber,
      incorporationDate,
      businessType,
      officialWebsite,
      businessLogo,
      legalRepFullName,
      legalRepId,
      legalRepPosition,
      legalRepNationality,
      taxId,
      financialProfile,
      documentUrls,
    } = body;

    // All fields are now optional - no validation required
    // Users can submit with any combination of filled fields

    // Read current businesses.json file
    const filePath = path.join(process.cwd(), "public", "data", "businesses.json");
    const fileData = fs.readFileSync(filePath, "utf8");
    const businessesData = JSON.parse(fileData);

    // Generate new business ID
    const existingIds = businessesData.businesses.map((b: any) => b.id);
    const maxNum = existingIds
      .filter((id: string) => id.startsWith("bus-"))
      .map((id: string) => parseInt(id.split("-")[1]))
      .reduce((max: number, num: number) => Math.max(max, num), 0);
    const newId = `bus-${String(maxNum + 1).padStart(3, "0")}`;

    // Create new business object with optional field handling
    const newBusiness = {
      id: newId,
      businessName: businessName || "",
      registrationNumber: registrationNumber || "",
      incorporationDate: incorporationDate ? new Date(incorporationDate).toISOString() : "",
      businessType: businessType || "",
      officialWebsite: officialWebsite || "",
      businessLogo: businessLogo || "",
      legalRepFullName: legalRepFullName || "",
      legalRepId: legalRepId || "",
      legalRepPosition: legalRepPosition || "",
      legalRepNationality: legalRepNationality || "",
      taxId: taxId || "",
      financialProfile: Array.isArray(financialProfile) ? financialProfile : (financialProfile ? [financialProfile] : []),
      documentUrls: Array.isArray(documentUrls) ? documentUrls : [],
      description: "Submitted via KYB form",
      rating: 0,
      totalReviews: 0,
      walletAddress: body.walletAddress || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add new business to the array
    businessesData.businesses.push(newBusiness);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(businessesData, null, 4));

    return NextResponse.json(
      { success: true, data: newBusiness },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error creating business:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
