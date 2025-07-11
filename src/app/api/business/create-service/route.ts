import { NextRequest, NextResponse } from "next/server";
import { prismaClient } from "../../../../../prisma";

export async function POST(req: NextRequest) {
  const {
    billingData,
    customerData,
    agreementsData,
    startDate,
    endDate,
    pricing,
    account,
  } = await req.json();
//   console.log(
//     billingData,
//     customerData,
//     agreementsData,
//     startDate,
//     endDate,
//     pricing,
//     account
//   );

  const totalPrice = billingData.reduce(
    (acc: number, curr: { price: number }) => acc + curr.price,
    0
  );
  console.log(totalPrice);

  const service = await prismaClient.service.create({
   data: {
    business: {
        connect: {
            id: account
        }
    },
    name: "Service 1",
    
    description: "Service 1 description",
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    attachments: agreementsData,
    customerFields: customerData,
    products: billingData,
    price: totalPrice,
  },
});
}
