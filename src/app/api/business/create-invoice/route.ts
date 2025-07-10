import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../../../../prisma";

export async function POST(req: NextRequest) {
  console.log("API route hit!");

  try {
    const body = await req.json();
    console.log(" Body:", JSON.stringify(body, null, 2));

    const {
      ownerAddress,
      debtorAddress,
      description,
      startDate,
      endDate,
      billing,
      agreements,
      businessId,
    } = body;

    console.log(" Parsed:", {
      ownerAddress,
      debtorAddress,
      description,
      startDate,
      endDate,
      billing,
      agreements,
    });

    if (!debtorAddress || !description || !startDate || !endDate) {
      console.warn("⚠️ Missing required fields");
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    console.log(" Billing items:", JSON.stringify(billing?.items, null, 2));

    const mappedItems =
      billing?.items?.map((items: any) => ({
        quantity: parseInt(items.quantity) || 1,
        product: {
          connect: {
            id: items.productId,
          },
        },
      })) || [];

    console.log(" Mapped items:", JSON.stringify(mappedItems, null, 2));

    const newInvoice = await prismaClient.invoice.create({
      data: {
        ownerAddress: ownerAddress,
        debtorAddress,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        attachments: agreements || [],
        paidStatus: "PENDING",
        createdAt: new Date(),
        updatedAt: new Date(),
        business: {
          connect: {
            id: businessId, // 👈 ID của Business
          },
        },
        items: {
          create: mappedItems,
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    console.log(" New invoice created:", JSON.stringify(newInvoice, null, 2));

    return NextResponse.json(
      { success: true, data: newInvoice },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
