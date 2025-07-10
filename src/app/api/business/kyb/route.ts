import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../../../../prisma";

export async function POST(req: NextRequest) {
  console.log("🚀 [API] Create Product route hit!");

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

    if (
      !businessName ||
      !registrationNumber ||
      !incorporationDate ||
      !businessType ||
      !officialWebsite ||
      !legalRepFullName ||
      !legalRepId ||
      !legalRepPosition ||
      !legalRepNationality ||
      !taxId
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields!" },
        { status: 400 }
      );
    }

    const newBusiness = await prismaClient.business.create({
      data: {
        businessName,
        registrationNumber,
        incorporationDate: new Date(incorporationDate),
        businessType,
        officialWebsite,
        businessLogo: businessLogo,
        legalRepFullName,
        legalRepId,
        legalRepPosition,
        legalRepNationality,
        taxId,
        financialProfile: financialProfile || [],
        documentUrls: documentUrls || [],
      },
    });

    return NextResponse.json(
      { success: true, data: newBusiness },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error creating product:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
