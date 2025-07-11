import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../../../../prisma";
import { ContactInfo } from "@/app/business/create-offer/CreateOffer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessAddress,
      invoiceAddress,
      pricing,
      agreements = [],
      contactInfo = [],
      startDate,
      endDate,
    } = body;
    // console.log(contactInfo);
    // Basic validation
    if (!businessAddress || !invoiceAddress || !pricing || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    let user = await prismaClient.user.findFirst({
      where: {
        address: businessAddress,
      },
    });
    if (!user) {
      console.log("User not found, creating user");
      user = await prismaClient.user.create({
        data: {
          address: businessAddress,
          email: businessAddress,
        },
      });
    }

    // Create Offer
    const newOffer = await prismaClient.offer.create({
      data: {
        invoiceAddress,
        pricing: parseFloat(pricing),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        attachments: agreements,
        business: {
        },
      },
      include: {
        offerContacts: true,
      },
    });

    return NextResponse.json(
      { success: true, data: newOffer },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error creating offer:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
