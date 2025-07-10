// app/api/product/route.ts (hoặc đường dẫn bạn đã để)
import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../../../../prisma"; // Đường dẫn này ok nếu bạn để đúng

export async function POST(req: NextRequest) {
  console.log("🚀 [API] Create Product route hit!");

  try {
    const body = await req.json();
    console.log("📦 Body:", JSON.stringify(body, null, 2));

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

    const newProduct = await prismaClient.product.create({
      data: {
        productName,
        productType,
        price: parseFloat(price),
        unitOfMeasure,
        description: description || null,
        images: images || [],
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      },
    });

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
