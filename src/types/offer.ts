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

export interface OfferCardProps {
  offer: OfferDatas;
  index: number;
  onView?: (offer: OfferDatas) => void;
  onEdit?: (offer: OfferDatas) => void;
  onDelete?: (offerId: string) => void;
}
