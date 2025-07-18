// app/api/product/route.ts
import fs from "fs";
import { NextRequest, NextResponse } from "next/server";
import path from "path";

export async function POST(req: NextRequest) {
  console.log("🚀 [API] Create Product route hit!");

  try {
    const body = await req.json();
    console.log("📦 Request Body:", JSON.stringify(body, null, 2));

    const {
      productName,
      productType,
      price,
      unitOfMeasure,
      description,
      images,
      startDate,
      endDate,
    } = body;

    // Validate required fields
    if (
      !productName ||
      !productType ||
      !price ||
      !unitOfMeasure ||
      !startDate ||
      !endDate
    ) {
      return NextResponse.json(
        { success: false, error: "Missing required fields!" },
        { status: 400 }
      );
    }

    // Read current products.json file
    const filePath = path.join(process.cwd(), "public", "data", "products.json");
    let productsData: { products: any[] } = { products: [] };
    
    try {
      const fileData = fs.readFileSync(filePath, "utf8");
      productsData = JSON.parse(fileData);
    } catch (error) {
      console.log("📄 Creating new products.json file");
      // Create the directory if it doesn't exist
      const dir = path.dirname(filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }

    // Generate new product ID
    const existingIds = productsData.products.map((product: any) => product.id);
    const maxNum = existingIds
      .filter((id: string) => id.startsWith("prod-"))
      .map((id: string) => parseInt(id.split("-")[1]))
      .reduce((max: number, num: number) => Math.max(max, num), 0);
    const newId = `prod-${String(maxNum + 1).padStart(3, "0")}`;

    // Create new product object
    const newProduct = {
      id: newId,
      productName,
      productType,
      price: parseFloat(price),
      unitOfMeasure,
      description: description || "",
      images: images || [],
      startDate: new Date(startDate).toISOString(),
      endDate: new Date(endDate).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add new product to the array
    productsData.products.push(newProduct);

    // Write back to file
    fs.writeFileSync(filePath, JSON.stringify(productsData, null, 4));

    console.log("✅ Product created:", newProduct);

    return NextResponse.json(
      { success: true, data: newProduct },
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
