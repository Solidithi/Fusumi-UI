"server only"

import { PinataSDK } from "pinata"
import dotenv from 'dotenv'
dotenv.config()

console.log(process.env.PINATA_JWT)
console.log(process.env.NEXT_PUBLIC_GATEWAY_URL)

export const pinata = new PinataSDK({
  pinataJwt: `${process.env.PINATA_JWT}`,
  pinataGateway: `${process.env.NEXT_PUBLIC_GATEWAY_URL}`
});

pinata.testAuthentication().catch((error: any) => {
  console.error("Pinata authentication failed:", error);
});