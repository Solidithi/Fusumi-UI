import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  console.log("🚀 [API] Create Service route hit!");

  try {
    const body = await req.json();
    console.log("🔧 Request Body:", JSON.stringify(body, null, 2));

    const {
      billingData,
      customerData,
      agreementsData,
      startDate,
      endDate,
      pricing,
      account,
      serviceName,
      description,
    } = body;

    // Validate required fields
    if (!serviceName || !startDate || !endDate) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: serviceName, startDate, endDate" },
        { status: 400 }
      );
    }

    // Calculate total price from pricing object
    const totalPrice = pricing?.amount || 0;

    // Read current services.json file
    const filePath = path.join(process.cwd(), "public", "data", "services.json");
    let servicesData: { services: any[] } = { services: [] };
    
    try {
      const fileData = fs.readFileSync(filePath, "utf8");
      servicesData = JSON.parse(fileData);
    } catch (error) {
      console.log("📄 Creating new services.json file");
      // Create the directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Generate new service ID
    const existingIds = servicesData.services.map((service: any) => service.id);
    const maxNum = existingIds
      .filter((id: string) => id.startsWith("srv-"))
      .map((id: string) => parseInt(id.split("-")[1]))
      .reduce((max: number, num: number) => Math.max(max, num), 0);
    const newId = `srv-${String(maxNum + 1).padStart(3, "0")}`;

    // Create new service object
    const newService = {
      id: newId,
      businessId: account || "",
      name: serviceName,
      description: description || "",
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      attachments: agreementsData || [],
      customerFields: customerData || [],
      billing: billingData || [],
      pricing: pricing || {},
      totalPrice,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add new service to the array
    servicesData.services.push(newService);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(servicesData, null, 4));

    console.log("✅ Service created:", newService);

    return NextResponse.json(
      { success: true, data: newService },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error creating service:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
