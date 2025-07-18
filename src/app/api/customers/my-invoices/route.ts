import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../../../../prisma";

export async function GET(req: NextRequest) {
  console.log("API route hit!");

  try {
    const invoices = await prismaClient.invoice.findMany({
      include: {
        business: { select: { businessType: true } },
        items: {
          include: {
            product: { select: { price: true } },
          },
        },
      },
    });

    const enriched = invoices.map((inv) => ({
      ...inv,
      totalPrice: inv.items.reduce(
        (sum, item) => sum + item.quantity * item.product.price,
        0
      ),
    }));

    return NextResponse.json(
      { success: true, data: enriched },
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
