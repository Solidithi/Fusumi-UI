export interface OfferData {
  id: string;
  title: string;
  image: string;
  owner: string;
  ownerAvatar: string;
  tokenCount: number;
  startDate: string;
  endDate: string;
  price: number;
  // rarity?: "common" | "rare" | "epic" | "legendary";
  category?: string;
}

export interface ServiceData {
  id: string;
  businessName: string;
  businessLogo: string;
  serviceName: string;
  price: number;
  description?: string;
  category?: string;
}

export type MarketplaceTab = "offer" | "service";
