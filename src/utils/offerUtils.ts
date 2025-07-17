import { EnhancedOffer, Offer, OfferStatus } from "@/types/offer";

export function inferOfferStatus(offer: Offer): OfferStatus {
  const currentDate = new Date();
  const startDate = new Date(offer.startDate);
  const endDate = new Date(offer.endDate);

  if (currentDate < startDate) {
    return "pending";
  } else if (currentDate > endDate) {
    return "expired";
  } else {
    return "active";
  }
}

export function toEnhancedOffer(offer: Offer): EnhancedOffer {
  return {
    ...offer,
    status: inferOfferStatus(offer),
  };
}
