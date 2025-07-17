import { invoices, invoiceProducts } from "@/../public/data/invoices.json";
import { products } from "@/../public/data/products.json";

/**
 * Interface for invoice data
 */
type Offer = any;

export interface Invoice {
  id: string;
  amount: number;
  description: string;
  dueDate: string;
  businessId: string;
  customerId: string;
  status: "pending" | "paid" | "overdue";
  createdAt: string;
}

/**
 * Calculate remaining percentage available for sale for a given invoice
 */
export function calcRemainingPercentageOfRootNft(
  offers: Offer[],
  invoiceId: string
): number {
  let totalSold = 0;

  offers.forEach((offer) => {
    if (offer.isRootNft || offer.invoiceId !== invoiceId) {
      return;
    }
    totalSold += offer.sharePercentage;
  });

  return Math.max(0, 100 - totalSold);
}

/**
 * Get invoice amount by invoice ID
 */
export function getInvoiceAmount(invoiceId: string): number {
  let total = 0;
  const productMap = new Map<string, (typeof products)[0]>();

  for (const invoiceProduct of invoiceProducts) {
    if (invoiceProduct.invoiceId !== invoiceId) {
      continue;
    }

    let product = productMap.get(invoiceProduct.productId);
    if (!product) {
      // find product in products.json
      product = products.find((p) => p.id === invoiceProduct.productId);
      if (!product) {
        continue; // Skip if product not found
      }
      productMap.set(invoiceProduct.productId, product);
    }

    total += product.price * invoiceProduct.quantity;
  }

  return Math.round(total);
}

/**
 * Calculate offer pricing based on invoice amount and share percentage
 */
export function calculateOfferPricing(
  invoiceAmount: number,
  sharePercentage: number
): number {
  return (invoiceAmount * sharePercentage) / 100;
}

/**
 * Validate NFT hierarchy rules
 */
export function validateNftHierarchy(offer: Offer): boolean {
  // Rule 1: If rootNftId is null, isRootNft must be true
  if (offer.rootNftId === null && offer.isRootNft !== true) {
    return false;
  }

  // Rule 2: If rootNftId is not null, isRootNft must be false
  if (offer.rootNftId !== null && offer.isRootNft !== false) {
    return false;
  }

  // Rule 3: Root NFT must have remainingPercentage calculated correctly
  if (offer.isRootNft) {
    const expectedRemaining = 100 - offer.sharePercentage;
    if (offer.remainingPercentage !== expectedRemaining) {
      return false;
    }
  }

  return true;
}

/**
 * Find the root NFT for a given invoice
 */
export function findRootNft(offers: Offer[], invoiceId: string): Offer | null {
  return (
    offers.find(
      (offer) => offer.invoiceId === invoiceId && offer.isRootNft === true
    ) || null
  );
}

/**
 * Find all child NFTs for a given root NFT
 */
export function findChildNfts(offers: Offer[], rootNftId: string): Offer[] {
  return offers.filter((offer) => offer.rootNftId === rootNftId);
}

/**
 * Calculate total value sold for an invoice
 */
export function calculateTotalValueSold(
  offers: Offer[],
  invoiceId: string
): number {
  const relatedOffers = offers.filter((offer) => offer.invoiceId === invoiceId);
  return relatedOffers.reduce((total, offer) => total + offer.pricing, 0);
}
