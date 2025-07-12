export interface InvoiceDetailData {
  id: string;
  debtorAddress: string;
  description: string;
  startDate: string;
  endDate: string;
  products: InvoiceProduct[];
  total: {
    price: number;
    quantity: number;
  };
}

export interface InvoiceProduct {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface ServiceDetailData {
  id: string;
  serviceName: string;
  businessName: string;
  description: string;
  startDate: string;
  endDate: string;
  price: number;
  features: string[];
  image?: string;
}

export interface RepayModalData {
  invoiceId: string;
  addressOwner: string;
  addressDebtor: string;
  unitDebt: number;
  fieldCompany: string;
  endDate: string;
}
