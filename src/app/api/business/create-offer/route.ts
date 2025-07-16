import { v4 as uuidv4 } from "uuid";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      businessAddress,
      invoiceAddress,
      pricing,
      agreements = [],
      contactInfo = {},
      startDate,
      endDate,
    } = body;
    // Basic validation

    console.log("body: ", body);

    if (
      !businessAddress ||
      !invoiceAddress ||
      !pricing ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }
    // Find or create user in users.json
    const usersPath = path.join(process.cwd(), "public/data/users.json");
    let users = [];
    try {
      users = JSON.parse(fs.readFileSync(usersPath, "utf-8"));
    } catch (e) {
      users = [];
    }

    // Create Offer
    const offersPath = path.join(process.cwd(), "public/data/offers.json");
    let offers = [];
    try {
      offers = JSON.parse(fs.readFileSync(offersPath, "utf-8"));
    } catch (e) {
      offers = [];
    }
    const newOffer = {
      id: uuidv4(),
      invoiceId: invoiceAddress,
      businessAddress,
      pricing: parseFloat(pricing),
      agreements,
      contactInfo,
      startDate,
      endDate,
      createdAt: new Date().toISOString(),
    };
    offers.push(newOffer);
    fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2));
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
