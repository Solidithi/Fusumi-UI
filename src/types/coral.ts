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
