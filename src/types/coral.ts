import corals from "@/../public/data/corals.json";

export interface OfferDatas {
  id: string;
  invoiceAddress: string;
  pricing: number;
  contactInfo: {
    name: string;
    email: string;
    phone: string;
    company: string;
    address: string;
  };
  startDate: string;
  endDate: string;
  agreements: string[];
  status: "active" | "pending" | "expired" | "draft";
  createdAt: string;
  updatedAt: string;
}

export type Coral = (typeof corals)[0];

export type CoralStatus = "active" | "pending" | "expired" | "draft";

export type EnhancedCoral = Coral & {
  status: CoralStatus;
};

export interface CoralNFT {
  id: string;
  invoiceId: string;
  sellerId: string;
  rootNftId: string | null;
  rootNftValue: number;
  pricing: number;
  sharePercentage: number;
  remainingPercentage: number;
  isPartialSale: boolean;
  isRootNft: boolean;
  debtNftImageUrl: string;
  contactInfo: {
    name?: string;
    email?: string;
    phone?: string;
    company?: string;
    address: string;
  };
  agreements: string[];
  startDate: string;
  endDate: string;
  createdAt: string;
  title: string;
  category: string;
  rarity: string;
  ownerAvatar: string;
}

export interface PurchaseData {
  branchId: string;
  buyerAddress: string;
  sharePercentage: number;
  totalPrice: number;
  parentNftId: string;
}
