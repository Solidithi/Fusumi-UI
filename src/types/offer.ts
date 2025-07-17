import offers from "@/../public/data/offers.json";

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

export type Offer = (typeof offers)[0];

export type OfferStatus = "active" | "pending" | "expired" | "draft";

export type EnhancedOffer = Offer & {
  status: OfferStatus;
};
